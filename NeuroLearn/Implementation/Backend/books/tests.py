from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

class BookTest(APITestCase):

    def test_create_book(self):
        url = reverse('book-list')
        data = {"title": "Test Book", "author": "Shashank"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "Test Book")
