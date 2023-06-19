# Express + EJS Starter

![screenshot](https://github.com/szhabolcs/express-ejs-starter/assets/54114237/0a2564e7-9e70-4411-ab26-a286f5fc76a7)

The project uses the MVC pattern where **models** are handled using Sequalize and the **views** by EJS. These two are linked using **controllers**.
<br> In addition, Express is used for managing routes, and calling controllers.

# Project structure

| Folder/File | Description |
| --- | --- |
| .vscode | Contains the launch.json file, which creates a run configuration. <br> See more at [Debugging](#debugging) |
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

# Project setup

The setup process is pretty simple. All you have to do is:

1. Run `npm install` from the root of the project
2. Create a `.env` file, inside the root
<br> You can copy over the config from `.env.example` to get started

Now you’re ready to run the project!

You have some npm commands to choose from:
| Script | Description |
| --- | --- |
| `npm run test:nm` | starts the server using Nodemon <br> ℹ️ when starting the app using Nodemon, it will restart the server each time you edit a file |
| `npm run start` | simply starts the server |
| `npm run test` | starts the server with debug logs |

For now, let’s use the **test:nm** command.

If everything works correctly, the message *Server started at http://localhost:3000* should appear in the console, and you should be able to test the site.



# General info

### How MVC works

The path of the request is as follows:

|![image](https://github.com/szhabolcs/express-ejs-starter/assets/54114237/8aff7082-d324-4a93-8042-857664d16266)|
|:--:|
|[https://excalidraw.com/#json=88vxzAU1tL0MwlqdGp_ws,VE2CkmH2oWItfEY3qjeJwQ](https://excalidraw.com/#json=88vxzAU1tL0MwlqdGp_ws,VE2CkmH2oWItfEY3qjeJwQ)|

We can see that the following steps take place:

1. The user makes a **request** (goes to a page)
2. The server checks which page is requested and calls the controller function assigned to that page
3. The controller then manipulates the database using models and lastly renders the view (meaning that it makes the HTML page) and sends it back to the user (this will be the **response**)

Now let’s see a concrete example:

|![image](https://github.com/szhabolcs/express-ejs-starter/assets/54114237/0c50b768-b42f-485c-b71c-566bfac5be3f)|
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
<br> ℹ️ We’re using the following pattern: `localhost:3000`/`router`/`path`
4. Now, the router is going to call the `DBTestController`'s `testPage` function.
This function checks if the User table exists. This is just a dummy test to check if the database is up and running. After checking, the `db-test` page is rendered, and sent right back to the user.
<br> ℹ️ We send some data to the page, using the `res.locals` variable.
We can then use the variables provided inside the .ejs file:
`… <% if (connected) { %> …`

### .env files
An .env file is a text file used in application development to store configuration variables. It contains key-value pairs, often used for sensitive or environment-specific information such as API keys or database credentials.
<br> These variables are only available in server-side code, but since our backend handles the rendering of pages, they are also available inside ejs files.

They can be accessed using `process.env.<varibale-name>`, for example:
```js
// ./db/config.js
...
process.env.DB_NAME,
process.env.DB_USERNAME,
process.env.DB_PASSWORD,
...
```

### Middlewares and error handling
When an error occurs, it's handled by the `errorHandler` function inside the `./middlewares/error-handler.js` file.
This function takes a JavaScript `Error` object, and passes it's message to the `error.ejs` view.

When something goes wrong, and you want to tell the user that there has been an error,
you can do so, by throwing a new `PageError` with a message, and a status code.
<br> For example:

```js
// ./middlewares/undefined-page.js
import { PageError } from "../utils/custom-errors.js";
import { StatusCodes } from "http-status-codes";

export default function undefinedPage(req, _res) {
    // throws an error, this will be caught by the errorHandler middleware
    throw new PageError(`Page '${req.path}' does not exist`, StatusCodes.NOT_FOUND);
}
```

If you want, you can make more cunstom errors inside the `./utils/custom-errors.js` file.

### Debugging
In order to start the server in debug mode, go inside the `./package.json` file, hover over the script that you want to run, and click `Debug Script`:
<br> ![NPM script debugging](https://github.com/szhabolcs/express-ejs-starter/assets/54114237/9af53e78-389a-44d9-aaf1-b9b1785ee770)

If that method isn't working, you can do the following: 
<br>
Inside VSCode select the `Start project` configuration at the Debugging tab. This will start the server with a debugger attached.

After which you can add a breakpoint anywhere in the code.

### ESLint
> ESLint statically analyzes your code to quickly find problems. It is built into most text editors and you can run ESLint as part of your continuous integration pipeline. <br> ~ https://eslint.org/

The project contains an `.eslintrc.json` file, that specifies what common mistakes should VSCode tell you about.

In order for this to work, make sure that you have the `ESLint` extension: [link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

### Sequalize and databases
The project is configured with the Sequalize ORM, but can be modified to use any other ORM or database driver directly (like mysql2, etc).

Sequalize makes it easy to work with a database, since you don't have to deal with SQL scripts if you don't want to. It even creates the tables for you, based on the configuration you provided.

To get started you can modify the `./db/config.js` file, or the `.env` file.
```js
return new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_SEQUALIZE_DIALECT,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            storage: "./db/database.sqlite"
        }
    );
```
The project is set up using SQLite, which is a database that lives on the disk, so you don't need to use a server for it. You can use MYSQL, ORACLE, MSSQL or any other database.
<br>For example, you can use it with [mysql](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#mysql).

After you're done setting up your database, you need to create some models.

In the context of our project structure, models are JavaScript files that describe how the table should look like, and export functions that manipulate that table.
<br>For example, take the provided `UserModel.js` file

```js
import { DataTypes } from "sequelize";          // We import the datatypes
import { getClient } from "../db/config.js";    
import logger from "../utils/logging.js";       // We use the provided logging function for pretty printing

const sequelize = getClient();                  // We get a client instance

// We define the table
const User = sequelize.define('User', {    // CREATE TABLE `User`
    // Model attributes are defined here
    firstName: {                           // `firstName` VARCHAR(255) NOT NULL
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {                            // `lastName` VARCHAR(255)
        type: DataTypes.STRING
        // allowNull defaults to true
    }
}, { "tableName": "User" });

await User.sync();                       // Syncing makes sure the table is added to the database

async function tableExists() {
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    logger.debug(tableNames);
    
    return tableNames.includes('User');
}

export default {
    tableExists
}
```
In this example, we can see that we export the `tableExists` function, but for example, we could have a `findByFirstName` function like so:

```js
async function findByFirstName(name) {
    const users = await User.findAll({
        where: {
            firstName: name
        }
    });

    return users;
}
```

Every interaction with the database should be inside a model. This way, we separate the business logic (a.k.a. what the app is doing) from the database operations. This leads to more readable code, and reusable functions.

### Client-side CSS and JavaScript

If you want to use CSS and/or JavaScript inside a page, you can do so by creating a new file inside the `./public` folder, and adding it to the page.

The project provides several useful CSS files by default:
| Name | Description |
| ---- | ----------- |
| `./stylesheets/global.css` | It imports fonts, includes a [CSS Reset](https://en.wikipedia.org/wiki/Reset_style_sheet), and adds some basic styling to the page |
| `./stylesheets/colors.css` | Defines colors that you use inside the app, using [CSS Variables](https://www.w3schools.com/css/css3_variables.asp). It also provides easy dark/light theme customization, by first, setting the colors inside the first block, and then overriding them for a light theme in the second. <br> Theme selection is based on the [user's machine](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme). You can read more about this approach [here](https://dev.to/laurilllll/how-to-create-dark-mode-using-only-css-2cb4)

For an example on how to add CSS and JavaScript to a view, check the `./views/index.ejs` file.

ℹ️ As a rule of thumb you should create your CSS/JS files with the same name as the view, to keep things tidy.

# Creating a new page

You can use this checklist once you're familiar with the project.
<br>❗But if you're just starting out, refer to one of the [examples](#examples) in the next section.

### Use the following checklist when making a new page:

1. Create a new `<page-name>.ejs` file inside the `views` folder
    ```html
    <!-- ./views/<page-name>.ejs -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link rel='stylesheet' href='/stylesheets/global.css' />
        <title>Title</title>
    </head>
    <body>
    </body>
    </html>
    ```
2. Specify at what path the file should be shown
    #### If you’re adding a new path to an existing router:
    
    1. Create a new function that will render the page

        ```js
        // ./controllers/<controller-name>.js
        ...
        async function <function-name>(req, res, next) {
            // Variables sent to the view
            res.locals = {};
            // Name of the .ejs file to show
            res.render('<page-name>');
        }
        ...
        export default {
            <function-name> // <- Don't forget to export the function
        }
        ```
    2. Specify the path where the function will be called
        ```js
        // ./routes/<router-name>.js
        ...
        router.get('/<path>', <controller-name>.<function-name>);
        ...
        ```
    ---
    
    #### If you’re making a new router:
    
    1. Create a new `<router-name>.js` file inside the `routes` folder, with the following code:
        
        ```js
        // ./routes/<router-name>.js
        import express from "express";
        const router = express.Router();
        
        export default router;
        ```

    2. Specify at what path the controller should be called:

        ```js
        // ./app.js

        // import routers
        import <router-name> from './routes/<router-name>.js';
        ...
        // set routes
        app.use('/<router-path>', <router-name>);
        ```
    2. Create a `<controller-name>.js` file in the `controllers` folder, and a new function that will render the page:

        ```js
        // ./controllers/<controller-name>.js
        async function <function-name>(req, res, next) {
            // Variables sent to the view
            res.locals = {};
            // Name of the .ejs file to show
            res.render('<page-name>');
        }

        export default {
            <function-name> // <- Don't forget to export the function
        }
        ```
    3. Import the controller and specify the path where the function will be called
        
        ```js
        // ./routes/<router-name>.js
        // Controller import 👇
        import <controller-name> from "../controllers/<controller-name>.js";
        ...
        router.get('/<path>', <controller-name>.<function-name>);
        ...
        ```

## Examples

### Creating a new router

1. Create a `test.ejs` file inside the `views` folder, with the following code:
<br> ℹ️ Using `<%= message %>` the page expects the controller to set a variable called `message`, check step 3 
    
    ```html
    <!-- ./views/test.ejs -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- More info about global.css at the *Client-side CSS and JavaScript* section -->
        <link rel='stylesheet' href='/stylesheets/global.css' />
        <title>Test page</title>
    </head>
    <body>
        <%= message %>
    </body>
    </html>
    ```
    
2. Create a `test.js` file inside the `routes` folder, with the following code:
    
    ```js
    // ./routes/test.js
    import express from "express";
    const router = express.Router();
    
    export default router;
    ```
    
3. Create a `TestController.js` file inside the `controllers` folder, with the following code:
    
    ```js
    // ./controllers/TestController.js
    async function testPage(req, res, next) {
        // variables sent to the view
        res.locals = {
            message: "Hello World!"
        };

        // name of the .ejs file to show
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
    // Controller import 👇
    import TestController from "../controllers/TestController.js";
    import express from "express";
    const router = express.Router();
    
    export default router;
    ```
    
5. Lastly, we need to specify the paths:
    1. Inside the `app.js` file, we’ll set the path where the router is called.
    <br>By setting it to `/test` when the user navigates to `localhost:3000/test` the router will be called
        
        ```js
        // ./app.js

        // import routers
        import testRouter from './routes/test.js';
        ...
        // set routes
        app.use('/test', testRouter);
        ```
        
    2. Inside the `routes/test.js` file, we’ll set a path.
    <br>By only setting `/` , when the user navigates to `localhost:3000/test` the `testPage` function will be called
        
        ```js
        // ./routes/test.js
        import TestController from "../controllers/TestController.js";
        import express from "express";
        const router = express.Router();
        
        // Set a path 👇
        router.get('/', TestController.testPage);
        
        export default router;
        ```
6. Now we can navigate to `localhost:3000/test` to see the `test.ejs` page we made at step 1

### Creating a new path inside a router

1. Create a `foo.ejs` file inside the `views` folder, with the following code:
    
    ```html
    <!-- ./views/foo.ejs -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- More info about global.css at the *Client-side CSS and JavaScript* section -->
        <link rel='stylesheet' href='/stylesheets/global.css' />
        <title>Foo inside test</title>
    </head>
    <body>
        This file is available at /test/foo
    </body>
    </html>
    ```
    
2. Let’s add this file inside the `test` router, so we can access it at: `localhost:3000/test/foo`
   <br>In order to do that, we’ll have to create a new function inside the `TestController.js`
    
    ```js
    // ./controllers/TestController.js
    async function testPage(req, res, next) {
        res.locals = {
            message: "Hello World!"
        };
        res.render('test');
    }
    
    // New function 👇
    async function fooPage(req, res, next) {
        res.render('foo');
    }
    
    export default {
        testPage,
        fooPage    // <- Function is also exported
    }
    ```
    
3. We’ll call the `fooPage` function, when the user navigates to `/test/foo`
    
    ```js
    // ./routes/test.js
    import TestController from "../controllers/TestController.js";
    import express from "express";
    const router = express.Router();
    
    router.get('/', TestController.testPage);
    // New path 👇
    router.get('/foo', TestController.fooPage);
    
    export default router;
    ```
    
    ℹ️ We can see that we only set `/foo`, this is because we are inside the `/test` router, which we set in the previous example at step 5.i.
    

4. Now we can navigate to `localhost:3000/test/foo` to see the `foo.ejs` page we made at step 1
