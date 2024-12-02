from django.db import models

class PDF(models.Model):
    title = models.CharField(max_length=200)
    firebase_path = models.CharField(max_length=500)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title