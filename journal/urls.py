from django.urls import path
from .views import GratitudeEntryListCreate, GratitudeEntryDetail


urlpatterns = [
    path("gratitude/", GratitudeEntryListCreate.as_view(), name="gratitude-list"),
    path("gratitude/<int:pk>/", GratitudeEntryDetail.as_view(), name="gratitude-detail"),
]