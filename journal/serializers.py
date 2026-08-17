from rest_framework import serializers
from .models import GratitudeEntry


class GratitudeEntrySerializer(serializers.ModelSerializer):

    class Meta:
        model = GratitudeEntry
        fields = ["id", "title", "content", "mood", "date"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)