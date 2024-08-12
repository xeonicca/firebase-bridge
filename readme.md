# Firebase bridge
default url: [https://at-marker-extension-dev.web.app/](https://at-marker-extension-dev.web.app/)

## Setup

Install necessary modules by using pnpm
```
pnpm install
```

Build project
```
pnpm build
```

## Deploy

Install firebase tools

Log in firebase via CLI
```
firebase login
```

Once logged in, you can now run deploy command
```
firebase deploy
```

## Code explain
### authHandler.js
Where auth magic happens

### dataHandler.js
Handle firestore read/write

### storageHandler.js
Handle cloud storage read/write

## Test usage

### Create event
```
window.postMessage({
  action: 'create',
  actionType: 'data',
  params: [
    'test-event-123',
    {
      eventName: 'submit-form-button-clicked',
      eventType: 'click',
      trackSection: 'submit-form',
      trackId: 'submit-button',
      attributes: [
        { 
          tagName: 'button',
          className: { value: 'button', matching: 'contain' },
          href: { value: 'http://example.com', matching: 'exact' },
          text: { value: 'Submit|Cancel', matching: 'regex' },
          selector: 'button.submit-btn',
          xpath: 'form > button'
        },
        {
          tagName: 'a',
          selector: '#test-link'
        }
      ],
    } 
  ]
})
```

### Update event
```
window.postMessage({
  action: 'update',
  actionType: 'data',
  params: [
    'test-event-123',
    {
      attributes: [
        { 
          tagName: 'button',
          className: { value: 'button', matching: 'contain' },
          href: { value: 'http://example.com', matching: 'exact' },
          text: { value: 'Submit|Cancel', matching: 'regex' },
          selector: 'button.submit-btn',
          xpath: 'form > button'
        },
        {
          tagName: 'a',
          selector: '#test-link'
        },
        {
          tagName: 'a',
          selector: '#test-link-2'
        },
      ],
    } 
  ]
})
```

### Check if event exists
```
window.postMessage({
  action: 'check',
  actionType: 'data',
  params: [
    'submit-form',
    'submit-button'
  ]
})
```