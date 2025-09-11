from rest_framework import serializers
from .models import AddFranchise

class FranchiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddFranchise
        fields = '__all__'
