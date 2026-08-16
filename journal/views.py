from rest_framework import generics
from .models import GratitudeEntry
from .serializers import GratitudeEntrySerializer


class GratitudeEntryListCreate(generics.ListCreateAPIView):
    queryset = GratitudeEntry.objects.all()
    serializer_class = GratitudeEntrySerializer


class GratitudeEntryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = GratitudeEntry.objects.all()
    serializer_class = GratitudeEntrySerializer