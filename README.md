# Resume Builder API

A simple RESTful API to manage a Resume with incremental updates using redis, The API is pretty much flexible so, you could add a database driver later on.

## Installation

---

There's two ways to get up and running with the API

### 1. Docker

You need to have docker installed on your machine, then run the following commands.

```
    cp .env.example .env
    docker-compose up
```

## 2. Manual

You need to install the following software

1. **Redis**

then run

```
    # copy environment variables
    cp .env.example .env

    # install packages
    npm ci

    # either (for dev)
    npm run dev

    # or (for building)
    npm run build
    npm run start
```

## API Documentation

---

This API is documented through swagger. You can access the **Swagger UI** interface after running the app, you can find the url needed to access it in the **CLI logs**

This repo is intended for a task associated with a job offer.

### **Business Requirements:**

---

1. Design and **build a service** that supports a frontend browser based application that
   takes a user through the steps needed to build a resume.
2. The service should be
   exposed by an API that allows communication with the client application.
3. The resume
   builder backend should support **incrementally submitting** the resume data in each step.
   This would allow the end user to stop and later come back from the same client browser
   to continue building the resume.
4. **Security** and **flexibility** are both important aspects for
   this API.

## Workflow

1. Client (browser) send request to `login_as_guest`
2. when client get back the `token` should store it and send it with every subsequent request
3. client should send a request to **create resume** with empty object and store the id of the received resume
4. should incrementally patch the object without any errors

### **Side Notice:**

---

- **why i used jwt and login_as_guest rather than session with user ip address and user-agent?**

  - the main concern here is that most of user at any ISP get a dynamic ip address, so he'll lose his data once he restart the router or lose connection

- **what bugs does login as guest introduce and how to solve it?**

  - when using login as a guest the route is public and exposed for DDOS attack so we can add either a proxy server like nginx or API Gateway and configure a rate limiter for each ip address

- **why use redis and not use a database or memcache?**
  - redis is a powerful tool with supports json data and make manipulating it really easy, so, it's a better choice from memcache where you should stringify and parse every json object.
  - using a database would introduce lots of overhead that is not needed for this task.
  - also a database would be pricy for a task that handles flat data (without relations)
- **why i used patch update rather than views?**
  - using views (ex. page.1 or page.2) for the form would make the frontend tightly coupled with the backend, so, every change on the frontend forms would require backend updates
