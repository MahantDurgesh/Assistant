<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prediction Result</title>
</head>
<body>
    <h1>Prediction Result</h1>
    <ul>
        {% for class_name, score in class_scores.items() %}
            <li>{{ class_name }}: {{ score }}</li>
        {% endfor %}
    </ul>
</body>
</html>
