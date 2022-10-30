# [Django Dynamic DataTables](https://github.com/app-generator/django-dynamic-datatb)

Simple tool that **Generates Secure APIs** on top of `DRF` with minimum effort - actively supported by [AppSeed](https://appseed.us/).

<br />

> Features

- `DataTables` provided by `Simple DataTables`
- `Minimal Configuration` (single line in config for each model)
- `Handles any model` defined across the project

<br />

![Django Dynamic API - DRF Interface (open-source tool).](https://user-images.githubusercontent.com/51070104/197181145-f7458df7-23c3-4c14-bcb1-8e168882a104.jpg)

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

> **Step #6** - `Register the model` in `core/settings.py` (DYNAMIC_DATATB section)

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

![Django API Generator - POSTMAN Interface (open-source tool).](https://user-images.githubusercontent.com/51070104/197181265-eb648e27-e5cf-4f3c-b330-d000aba53c6a.jpg)

<br />

### Links & resources 

- [DRF](https://www.django-rest-framework.org/) - HOMEpage
- More [Developer Tools](https://appseed.us/developer-tools/) provided by `AppSeed`
- Ask for [Support](https://appseed.us/support/) via `Email` & `Discord` 

<br />

---
[Django Dynamic DataTables](https://github.com/app-generator/django-dynamic-datatb) - Open-source library provided by **[AppSeed](https://appseed.us/)**
