from django.urls import path
from .views import (
    GratitudeEntryListCreate,
    GratitudeEntryDetail,
    RegisterView,
    LoginView,
)


urlpatterns = [
    path("gratitude/", GratitudeEntryListCreate.as_view(), name="gratitude-list"),
    path("gratitude/<int:pk>/", GratitudeEntryDetail.as_view(), name="gratitude-detail"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
]