import os
from django.conf import settings
import matplotlib.pyplot as plt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import io

def save_plot(plot_img_path):
    # Save plot to a BytesIO buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()
    
    # Save to storage
    file_path = f'media/{plot_img_path}'
    default_storage.save(file_path, ContentFile(buffer.getvalue()))
    
    # Return URL
    if hasattr(settings, 'AWS_STORAGE_BUCKET_NAME') and settings.AWS_STORAGE_BUCKET_NAME:
        img_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/media/{plot_img_path}"
    else:
        img_url = settings.MEDIA_URL + plot_img_path
    
    return img_url