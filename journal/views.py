from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny ,  IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import GratitudeEntry
from .serializers import GratitudeEntrySerializer

class GratitudeEntryListCreate(generics.ListCreateAPIView):
    serializer_class = GratitudeEntrySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return GratitudeEntry.objects.filter(user=self.request.user)


class GratitudeEntryDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GratitudeEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GratitudeEntry.objects.filter(user=self.request.user)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password
        )

        token = Token.objects.create(user=user)

        return Response({
            "message": "Account created successfully",
            "token": token.key,
            "username": user.username
        })


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid username or password"},
                status=400
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "token": token.key,
            "username": user.username
        })