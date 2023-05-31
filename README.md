# Express + EJS Starter

The project uses the MVC pattern where **models** are handled using Sequalize and the **views** by EJS. These two are linked using **controllers**.

# Project structure

In addition, Express is used for managing routes, and calling controllers.

| Folder/File | Description |
| --- | --- |
| .vscode | Contains the launch.json file, which creates a run configuration. <br> See more at DEBUGGING_HEADING |
| bin | Contains the server.js file, which starts the an HTTP server |
| controllers | Functions that handle HTTP requests <br> Each file representing a page, or an API endpoint |
| db | Contains the Sequalize config |
| middlewares | Functions that run before or after controllers. They manipulate data and are an essential part of Express |
| models | Functions that help interact with the database. <br> Each file representing a table |
| public | Public assets used by the site. <br> Can be accessed from the root of the domain, for ex.: http://localhost:3000/stylesheets/global.css |
| routes | Contains all the routes (a.k.a. pages), that the site will have |
| utils | Helper functions |
| views | Contains all EJS pages. These will be rendered inside the controllers, by specifying the desired page name, for ex.: <br> `res.render('index')` where `index` is the `/views/index.ejs` file |
| .env | Configuration file for the project |
| .eslintrc.json | ESLint configuration |
| app.js | Initializes Express. This file is also used to initialize routers |

# Setup

The setup process is pretty simple. All you have to do is:

1. Run `npm install` from the root of the project
2. Create a `.env` file, inside the root
You can copy over the config from `.env.example` to get started

Now you’re ready to run the project!

You have some npm commands to choose from:
| Script | Description |
| --- | --- |
| `npm run test:nm` | starts the server using Nodemon <br> ℹ️ when starting the app using Nodemon, it will restart the server each time you edit a file |
| `npm run start` | simply starts the server |
| `npm run test` | starts the server with debug logs |

For now, let’s use the **test:nm** command.

If everything works correctly, the message *Server started at http://localhost:3000* should appear in the console, and you should be able to test the site.

# How MVC works

The path of the request is as follows:

|![image](https://github.com/szhabolcs/twitter-clone/assets/54114237/88f8f378-379a-48b3-b30a-2e5379932c86)|
|:--:|
|[https://excalidraw.com/#json=88vxzAU1tL0MwlqdGp_ws,VE2CkmH2oWItfEY3qjeJwQ](https://excalidraw.com/#json=88vxzAU1tL0MwlqdGp_ws,VE2CkmH2oWItfEY3qjeJwQ)|

We can see that the following steps take place:

1. The user makes a **request** (goes to a page)
2. The server checks which page is requested and calls the controller function assigned to that page
3. The controller then manipulates the database using models and lastly renders the view (meaning that it makes the HTML page) and sends it back to the user (this will be the **response**)

Now let’s see a concrete example:

|![image](https://github.com/szhabolcs/twitter-clone/assets/54114237/1206b177-b369-4012-a0e6-6eb913d53e74)|
|:--:|
|[https://excalidraw.com/#json=4KSPNVorCpccRmMSgLj44,rFj-tyQkFRA4Qt95-sss5Q](https://excalidraw.com/#json=rrp1BKKHIDfiS2fdJmjkD,ixhy0kzUIj4YboXUB275hg)|

The following steps take place:

1. Express checks if the `/db-test` route exists.
We can see that it does, because we’ve set it inside the `app.js` file:
`app.use('/db-test', dbTestRouter)`
2. So it’s going to call the `dbTestRouter`
At the top of the file, we can see the line: `import dbTestRouter from './routes/db-test.js'` which means, that the router comes from the `db-test` file inside the `routes` folder
3. In this file, we can see that the variable `router` is exported. This router is called, and it checks if the requested path matches any paths that have been set.
We can see that in our file, we’ve set the `/` path using `router.get('/', DBTestController.testPage)`, which just means the root of the router. This is exactly what our user wants, because `/db-test` is equal to `/db-test/`

ℹ️ We’re using the following pattern: `localhost:3000`/`router`/`path`
4. Now, the router is going to call the `DBTestController`'s `testPage` function.
This function checks if the User table exists. This is just a dummy test to check if the database is up and running. After checking, the `db-test` page is rendered, and sent right back to the user.
ℹ️ We send some data to the page, using the `res.locals` variable.
We can then use the variables provided inside the .ejs file:
`… <% if (connected) { %> …`

# Creating a new page

Use the following checklist when making a new page:

- [ ]  Create a new `ejs` file inside the `views` folder
- [ ]  Specify at what path the file should be loaded
    
    If you’re adding a new path to a router:
    
    - [ ]  Create a new function that will render the page inside the desired router’s controller, and call `res.render('<page-name>')`
    - [ ]  Specify the previous function inside the router, at the desired path
    
    If you’re making a new router:
    
    - [ ]  Create a new `js` file inside the routes folder, with the following boilerplate:
        
        ```js
        // ./routes/test.js
        import express from "express";
        const router = express.Router();
        
        export default router;
        ```
        
    - [ ]  Create a new `js` file inside the controllers folder
    - [ ]  Import the controller inside the router
        
        ```js
        // ./routes/test.js
        import ControllerName from "../controllers/ControllerName.js";
        import express from "express";
        const router = express.Router();
        
        export default router;
        ```
        
        ℹ️ The `ControllerName` in the router file, has to match the one we just created
        
    - [ ]  Specify the router inside the `app.js` file:
        
        ```js
        // ./app.js
        import testRouter from "./routes/test.js";
        // ...
        app.use('/test', testRouter);
        // ...
        ```
        
        ℹ️ The naming convention used is just a guide. You can use whatever you like
        
    - [ ]  Create a new function that will render the page inside the controller, and call `res.render('<page-name>')`

## Example: creating a new router

1. Create a `test.ejs` file inside the `views` folder, with the following boilerplate:
ℹ️ Using `<%= message %>` the page expects the controller to set a variable called `message`, check step 3 
    
    ```html
    <!-- ./views/test.ejs -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test page</title>
    </head>
    <body>
        <%= message %>
    </body>
    </html>
    ```
    
2. Create a `test.js` file inside the `routes` folder, with the following boilerplate:
    
    ```js
    // ./routes/test.js
    import express from "express";
    const router = express.Router();
    
    export default router;
    ```
    
3. Create a `TestController.js` file inside the `controllers` folder.
We will use the following boilerplate:
    
    ```js
    // ./controllers/TestController.js
    async function testPage(_req, res, _next) {
        res.locals = {
            message: "Hello World!"
        };
        res.render('test');
    }
    
    export default {
        testPage
    }
    ```
    
    ℹ️ We create the testPage function, that renders the `test.ejs` file. It also exports this function so it’s available outside the file. 
    
4. We now import the controller inside the router:
    
    ```js
    // ./routes/test.js
    import testController from "../controllers/TestController.js";
    import express from "express";
    const router = express.Router();
    
    export default router;
    ```
    
5. Lastly, we need to specify the paths:
    1. Inside the `app.js` file, we’ll set the path where the router is called.
    By setting it to `/test` when the user navigates to `localhost:3000/test` the router will be called
        
        ```js
        // ./app.js
        // ...
        import testRouter from './routes/test.js';
        // ...
        app.use('/test', testRouter);
        ```
        
        Inside the `routes/test.js` file, we’ll set a path.
        By only setting `/` , when the user navigates to `localhost:3000/test` the `testPage` function will be called
        
        ```js
        // ./routes/test.js
        import TestController from "../controllers/TestController.js";
        import express from "express";
        const router = express.Router();
        
        router.get('/', TestController.testPage);
        
        export default router;
        ```
        

## Example: creating a new path inside a router

1. Create a `foo.ejs` file inside the `views` folder, with the following boilerplate:
    
    ```html
    <!-- ./views/foo.ejs -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Foo inside test</title>
    </head>
    <body>
        This file is available at /test/foo
    </body>
    </html>
    ```
    
    Let’s add this file inside the `test` router, so we can access it at: `localhost:3000/test/foo`
    
2. We’ll have to create a new function inside the `TestController.js`
    
    ```js
    // ./controllers/TestController.js
    async function testPage(_req, res, _next) {
        res.locals = {
            message: "Hello World!"
        };
        res.render('test');
    }
    
    async function fooPage(_req, res, _next) {
        res.render('foo');
    }
    
    export default {
        testPage,
        fooPage    // <---- function is also exported
    }
    ```
    
3. We’ll call the `fooPage` function, when the user navigates to `/test/foo`
    
    ```js
    // ./routes/test.js
    import TestController from "../controllers/TestController.js";
    import express from "express";
    const router = express.Router();
    
    router.get('/', TestController.testPage);
    router.get('/foo', TestController.fooPage);
    
    export default router;
    ```
    
    ℹ️ We can see that we only set `/foo`, this is because we are inside the `/test` router, which we set in the previous example at step 5.a.
    

Now we can navigate to `localhost:3000/test/foo` to see the page we made at step 1