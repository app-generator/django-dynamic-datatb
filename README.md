# [Django Dynamic DataTables](https://app-generator.dev/docs/developer-tools/dynamic-datatables.html)

`Open-Source` library for **Django** that provides a `powerful data table interface` (paginated information) with minimum effort - actively supported by **[App-Generator](https://app-generator.dev/)**.

- [Django Dynamic DataTables](https://www.youtube.com/watch?v=EtMCK5AmdQI) - video presentation

<br />

---

> For a **complete set of features** and long-term support, check out **[Dynamic Django](https://app-generator.dev/docs/developer-tools/dynamic-django/index.html)**, a powerful starter that incorporates:

- [Dynamic DataTables](https://app-generator.dev/docs/developer-tools/dynamic-django/datatables.html): using a single line of configuration, the data saved in any table is automatically managed
- [Dynamic API](https://app-generator.dev/docs/developer-tools/dynamic-django/api.html): any model can become a secure API Endpoint using DRF
- [Dynamic Charts](https://app-generator.dev/docs/developer-tools/dynamic-django/charts.html): extract relevant charts without coding all major types are supported
- [CSV Loader](https://app-generator.dev/docs/developer-tools/dynamic-django/csv-loader.html): translate CSV files into Django Models and (optional) load the information
- Powerful [CLI Tools](https://app-generator.dev/docs/developer-tools/dynamic-django/cli.html) for the GIT interface, configuration editing, updating the configuration and database (create models, migrate DB)

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

> **Step #2** - Update Configuration, `add new imports`

```python
import os, inspect
import django_dyn_dt
```

<br />

> **Step #3** - Update Configuration, `include the new APPs`

```python
INSTALLED_APPS = [
    'django_dyn_dt',  # <-- NEW App
]
```

<br />

> **Step #4** - Update Configuration, include the new `TEMPLATES` DIR

```python

TEMPLATE_DIR_DATATB = os.path.join(BASE_DIR, "django_dyn_dt/templates") # <-- NEW App

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATE_DIR_DATATB],                                  # <-- NEW Include
        "APP_DIRS": True,
        "OPTIONS": {
        },
    },
]
```

<br />

> **Step #5** - Update Configuration, update `STATICFILES_DIRS` DIR

```python 
DYN_DB_PKG_ROOT = os.path.dirname( inspect.getfile( django_dyn_dt ) ) # <-- NEW App

STATICFILES_DIRS = (
    os.path.join(DYN_DB_PKG_ROOT, "templates/static"),
)
```

<br />

> **Step #6** - `Register the model` in `settings.py` (DYNAMIC_DATATB section)

This sample code assumes that `app1` exists and model `Book` is defined and migrated.

```python

DYNAMIC_DATATB = {
    # SLUG -> Import_PATH 
    'books'  : "app1.models.Book",
}

```

<br />


> **Step #7** - `Update routing`, include APIs 

```python
from django.contrib import admin
from django.urls import path, include         # <-- NEW: 'include` directive added

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('django_dyn_dt.urls')),  # <-- NEW: API routing rules
]    
```    

<br />

> **Step #8** - Use the Dynamic Datatable module 

If the managed model is `Books`, the dynamic interface is `/datatb/books/` and all features available. 

<br />

![Django Dynamic DataTables - Open-Source Tool for Developers.](https://user-images.githubusercontent.com/51070104/194706034-b691226d-f9fa-4c05-a828-fc947670c573.jpg)

<br />

### Links & resources 

- [DRF](https://www.django-rest-framework.org/) - HOMEpage
- More [Developer Tools](https://appseed.us/developer-tools/) provided by `AppSeed`
- Ask for [Support](https://appseed.us/support/) via `Email` & `Discord` 

<br />

---
[Django Dynamic DataTables](https://app-generator.dev/docs/developer-tools/dynamic-datatables.html) - Open-source library provided by **[App-Generator](https://app-generator.dev/)**
