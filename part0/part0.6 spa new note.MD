sequenceDiagram
participant browser
participant server

    Note right of browser: The browser sends the new note to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Header 201 Created
    deactivate server

    Note right of browser: The browser updates it's internal state of the list of notes

    Note right of browser: The browser re-render the DOM and show the newly created notes
