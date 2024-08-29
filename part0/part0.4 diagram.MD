sequenceDiagram
participant browser
participant server

    Note right of browser: The browser sends the new note to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note {"note": "X"}
    activate server
    server-->>browser: Header 302 Found
    deactivate server

    Note right of browser: The browser refresh the page after the request is made

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server


    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser shows the newly updated data retrieved from the server
