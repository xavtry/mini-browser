<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Tab</title>
    <!-- This page also uses styles.css for a consistent theme -->
    <link rel="stylesheet" href="styles.css">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="home-page">
    
    <div class="home-container">
        <h1 class="home-logo">
            <i class="fas fa-globe-americas"></i> Mini Browser
        </h1>
        
        <div class="search-container">
            <i class="fas fa-search"></i>
            <input type="text" id="home-search-input" placeholder="Search with Google or enter URL">
        </div>
        
        <div class="quick-links-container">
            <a href="https://github.com" class="quick-link">
                <i class="fab fa-github"></i>
                <span>GitHub</span>
            </a>
            <a href="https://google.com" class="quick-link">
                <i class="fab fa-google"></i>
                <span>Google</span>
            </a>
            <a href="https://youtube.com" class="quick-link">
                <i class="fab fa-youtube"></i>
                <span>YouTube</span>
            </a>
            <a href="https://developer.electronjs.org" class="quick-link">
                <i class="fas fa-code"></i>
                <span>Electron</span>
            </a>
        </div>
    </div>

    <!-- This page has its own simple script -->
    <script src="home.js"></script>
</body>
</html>
