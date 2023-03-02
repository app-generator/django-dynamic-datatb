import json
import math
from typing import List

import django.db.models
from django import views
from django.db.models import Q
from django.forms import DateField
from django import shortcuts
from django.http import HttpResponse
from django.template import loader
from django_dyn_dt.helpers import Utils


class DataTB(views.View):
    tables_pool = {}

    def __init__(self, model_class_path: str=None, **kwargs):
        super().__init__(**kwargs)
        if model_class_path is None:
            return
        self.model_class_path = model_class_path
        self.model_class: django.db.models.Manager = DataTB._find_model_class_by_path(model_class_path)
        DataTB.tables_pool[DataTB._find_class_name_by_path(model_class_path)] = self

    @classmethod
    def _find_model_class_by_path(cls, path):
        return Utils.model_name_to_class(path)

    @classmethod
    def _find_class_name_by_path(cls, path):
        return Utils.get_model_name_from_path(path)

    def _get_headings(self, model_class, filter_relations=True):
        headings = []
        for field in model_class._meta.get_fields():
            if filter_relations and self._is_relation_field(field):
                continue
            headings.append(field.name)
        return headings

    def _is_relation_field(self, field):
        is_many_to_many_field = field.many_to_many is not None
        is_many_to_one_field = field.many_to_one is not None
        is_one_to_many_field = field.one_to_many is not None
        is_one_to_one_field = field.one_to_one is not None
        return is_many_to_many_field or is_many_to_one_field or is_one_to_many_field or is_one_to_one_field

    def render(self):
        all_data = self.model_class.objects.all()
        return self._render(
            data=all_data[0:10],
            current_page=1,
            total_pages=range(1, math.ceil(all_data.count() / 10) + 1),
            entries_per_page=10,
            search_key='',
        )

    def _render(
            self,
            data: List,
            current_page: int,
            total_pages: range,
            entries_per_page: int,
            search_key: str,
    ) -> str:
        headings = self._get_headings(self.model_class)
        filter_options = Q()
        for field in headings:
            filter_options = filter_options | Q(**{field + '__icontains': search_key})

        return loader.render_to_string('datatb_template.html', context={
            'model_name': Utils.get_model_name_from_path(self.model_class_path),
            'headings': headings,
            'data': [[getattr(record, heading) for heading in headings] for record in data],
            'is_date': [True if type(field) == DateField else False for field in self.model_class._meta.get_fields()],
            'total_pages': total_pages,
            'has_prev': current_page != 1 and current_page <= current_page,
            'has_next': current_page >= len(total_pages),
            'current_page': current_page,
            'entries': entries_per_page,
            'search': search_key,
        })

    @staticmethod
    def find_self(model_name: str):
        for name, datatb in DataTB.tables_pool.items():
            if name == model_name:
                return datatb
        return None

    def get(self, request, model_name):
        datatb = DataTB.find_self(model_name)
        if datatb is None:
            return shortcuts.render(request, '404.html', status=404)
        page_number = int(request.GET.get('page', 1))
        if page_number < 1:
            return shortcuts.render(request, '404.html', status=404)
        search_key = request.GET.get('search', '')
        entries = int(request.GET.get('entries', 10))
        headings = datatb._get_headings(datatb.model_class)

        filter_options = Q()
        for field in headings:
            filter_options = filter_options | Q(**{field + '__icontains': search_key})

        all_data = datatb.model_class.objects.filter(filter_options)
        data = all_data[(page_number - 1) * entries:page_number * entries]
        if all_data.count() != 0 and not 1 <= page_number <= math.ceil(all_data.count() / entries):
            return shortcuts.render(request, '404.html', status=404)

        return HttpResponse(content=datatb._render(
            data=data,
            current_page=page_number,
            total_pages=range(1, math.ceil(all_data.count() / entries) + 1),
            entries_per_page=entries,
            search_key=search_key,
        ))

    def post(self, request, model_name):
        datatb: DataTB = DataTB.find_self(model_name)
        if datatb is None:
            return shortcuts.render(request, '404.html', status=404)
        body = json.loads(request.body.decode("utf-8"))
        try:
            thing = datatb.model_class.objects.create(**body)
        except Exception as ve:
            return HttpResponse(json.dumps({
                'detail': str(ve),
                'success': False
            }), status=400)
        return HttpResponse(json.dumps({
            'id': thing.id,
            'message': 'Record Created.',
            'success': True
        }), status=200)

    def delete(self, request, model_name, pk: int):
        datatb: DataTB = DataTB.find_self(model_name)
        if datatb is None:
            return shortcuts.render(request, '404.html', status=404)
        try:
            to_delete_object = datatb.model_class.objects.get(id=pk)
        except Exception as e:
            return HttpResponse(json.dumps({
                'message': 'matching object not found.',
                'success': False
            }), status=404)
        to_delete_object.delete()
        return HttpResponse(json.dumps({
            'message': 'Record Deleted.',
            'success': True
        }), status=200)

    def put(self, request, model_name: str, pk: int):
        datatb: DataTB = DataTB.find_self(model_name)
        if datatb is None:
            return shortcuts.render(request, '404.html', status=404)

        body = json.loads(request.body.decode("utf-8"))
        try:
            datatb.model_class.objects.filter(id=pk).update(**body)
        except Exception as ve:
            return HttpResponse(json.dumps({
                'detail': str(ve),
                'success': False
            }), status=400)
        return HttpResponse(json.dumps({
            'message': 'Record Updated.',
            'success': True
        }), status=200)
