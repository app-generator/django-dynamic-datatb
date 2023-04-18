# [Django Dynamic DataTables](https://appseed.us/developer-tools/django-dynamic-datatables/)

`Open-Source` library for **Django** that provides a `powerful data table interface` (paginated information) with minimum effort - actively supported by [AppSeed](https://appseed.us/).

- [Django Dynamic Services](https://github.com/app-generator/django-dynamic-services) - `sample project that uses the library`
- [Django - Build Services without Coding](https://www.youtube.com/watch?v=EtMCK5AmdQI) - `video presentation`

<br /> 

> Features

- Modern Stack: `Django` & `VanillaJS`
- `DT` layer provided by [Simple-DataTables](https://github.com/fiduswriter/Simple-DataTables)
- `Server-side` pagination
- Search, Filters
- Exports in PDF, CSV formats
- `MIT License` (commercial use allowed) 

<br />

![Django Dynamic DataTables - Open-Source tool provided by AppSeed.](https://user-images.githubusercontent.com/51070104/194712823-b8bf1a9e-f5d8-47b3-b7e6-a46a29f3acbe.gif)

<br />

## How to use it

<br />

> **Step #1** - `Install the package` 

```bash
$ pip install django-dynamic-datatb
// OR
$ pip install git+https://github.com/app-generator/django-dynamic-datatb.git
```

<br />

> **Step #2** - Update Django `settings.py`, `add new imports`

```python
import os, inspect
import django_dyn_dt
```

<br />

> **Step #3** - Update Django `settings.py`, `include the new APPs`

```python
INSTALLED_APPS = [
    'django_dyn_dt',  # <-- NEW App
]
```

<br />

> **Step #4** - Update Django `settings.py`, include the new `TEMPLATES` DIR

```python

DATATB_TEMPLATES = os.path.join(BASE_DIR, "django_dyn_dt/templates")   # <-- NEW Templates Include

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [DATATB_TEMPLATES],                                    # <-- NEW Include
        "APP_DIRS": True,
        "OPTIONS": {
        },
    },
]
```

<br />

> **Step #5** - Update Django `settings.py`, update `STATICFILES_DIRS` DIR

```python 
DYN_DB_PKG_ROOT = os.path.dirname( inspect.getfile( django_dyn_dt ) ) # <-- NEW App

STATICFILES_DIRS = (
    os.path.join(DYN_DB_PKG_ROOT, "templates/static"),
)
```

<br />


> **Step #6** -  Update Django routing `urls.py`, include APIs 

```python
from django.contrib import admin
from django.urls import path, include                 # <-- NEW: 'include` directive added
from django.views.decorators.csrf import csrf_exempt  # <-- NEW: csrf_exempt required 

urlpatterns = [
    path("admin/", admin.site.urls),

    path('datatb/<str:model_name>/<int:pk>/', csrf_exempt(DataTB.as_view())),  # <-- NEW: (Used by Dynamic DataTables)
    path('datatb/<str:model_name>/'         , csrf_exempt(DataTB.as_view())),  # <-- NEW: (Used by Dynamic DataTables)
    path('datatb/<str:model_name>/export/'  , csrf_exempt(export)),            # <-- NEW: (Used by Dynamic DataTables)

]    
```    

<br />

> **Step #7** - Use the Dynamic Datatable widget in controller

```python

from django_dyn_dt.datatb import DataTB

def dyn_datatb(request):

    context = {} 
        
    ddt = DataTB(model_class_path="home.models.Product")  # Link Dynamic view to a Model (full path)
    context['data_table1'] = ddt.render()                 # Render() returns the dynamic widget

    return render(request, 'pages/dyn-datatb.html', context=context)

```

<br />

![Django Dynamic DataTables - Open-Source Tool for Developers.](https://user-images.githubusercontent.com/51070104/194706034-b691226d-f9fa-4c05-a828-fc947670c573.jpg)

<br />

### Links & resources 

- [DRF](https://www.django-rest-framework.org/) - HOMEpage
- More [Developer Tools](https://appseed.us/developer-tools/) provided by `AppSeed`
- Ask for [Support](https://appseed.us/support/) via `Email` & `Discord` 

<br />

---
[Django Dynamic DataTables](https://appseed.us/developer-tools/django-dynamic-datatables/) - Open-source library provided by **[AppSeed](https://appseed.us/)**
