# LingoSpark
Allows to learn words and their meanings in other languages not only through basic flashcards, but also interactive
tests and matching challenge mode

> [!CAUTION]
> Dear teachers checking this repo:
> 
> so-called `dokumentacja techniczna` for web app is [here]()
> 
> so-called `dokumentacja techniczna` for mobile app is [here]() 

## Table of contents
1. [General info](#general-info)
2. [Used technologies](#used-technologies)
3. [Setup](#setup)
4. [Status](#status)
5. [Authors](#authors)

## General info

We wanted to create an app like quizlet, but with cleaner UI, cut out rarely used features and enhance the "Learn" mode.
Obviously for free without ads.

We tried our best to imitate the quiz page from quizlet. In order not to be sued by the big company behind the original one, we changed the color scheme to green.

Core features such as flashcards mode (with tracking progress), matching challenge (_pl. dopasowania_) learn mode (_pl. tryb "ucz się"_) were implemented into our app.
However, we enhanced them. For example, changed the learn mode to a test in a form of exercises from language textbook.
The user must first specify the number of questions for each type of task.
Then the AI models do their job of creating specifically tailored sentences with that user needs to fill.

In our app, the user has the ability to like or dislike a certain quiz.

## Used technologies

| category | technology |
|---|---|
| programming language | Typescript |
| backend | Express |
| web frontend | React |
| mobile framework | React Native Expo |
| ORM | Prisma |
| database | MySQL |
| environment | Docker |

## Setup

### Prerequisites
In order to run our app, you need to have:
- [docker](https://www.docker.com/get-started/) installed
- all `.env` files in correct places and with correct variables to be able to run all features of the app
- Github token set up, to be able to do knowledge tests, because example sentences are created by LLMs from github marketplace

### Setting up .env files

Just copy all .env.sample files in place

In `./frontend` folder there is one

In `./backend` folder there are three (app, database, mongo)

If you are lazy and have a Unix-based OS, you can copy-paste these commands into terminal and run them (starting from the project's root directory):
```sh
cd frontend
cp .env.sample .env
cd ../backend
cp .env.app.sample .env.app
cp .env.database.sample .env.database
cp .env.mongo.sample .env.mongo
cd ..
```

### Setting up github token

1. Go to [github](https://github.com/) and log in
2. Click on your profile picture in the top right corner
3. Click `settings`
4. Click `developer settings` at the bottom of the left panel
5. Click on `Personal access tokens` dropdown and then on `Tokens (classic)`
6. Click on `Generate new token` and choose the classic version
7. Authorize operation with github mobile (if you have the mobile authorization on)
8. In the `Note` input box, set the name that you will remember
9. Do not change any other options, keep them default 
10. Scroll to bottom and click `Generate token`
11. Copy the new token (next to green mark)
12. In `./backend/.env.app` file, replace `put_your_github_token_here` with the token you've just copied

### Running the app

In order to run the app, you need to go to project's root directory (in terminal) and run the command:
```sh
docker compose up --build
```

The `--build` option is there to ensure everything is built correctly

After the compose is fully built, you can access various components of our app through your browser:

| Url | Component                                                 |
|---|-----------------------------------------------------------|
| http://localhost:5173/ | The web app created in React                              |
| http://localhost:8081/ | Browser preview of the mobile app created in React Native |
| http://localhost:5555/ | Lightweight browser Prisma DBMS                           |
| http://localhost:3000/ | Backend API                                               |

## Status

Status of this project is: _in progress_

## Authors
People who created this app:

[wiktorKycia](https://github.com/wiktorKycia)

[JanTopolewski](https://github.com/JanTopolewski) 
