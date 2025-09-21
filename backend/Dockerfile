# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code to the working directory
COPY . .

# Define environment variable for the port
ENV PORT 8080

# Run main.py when the container launches using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]