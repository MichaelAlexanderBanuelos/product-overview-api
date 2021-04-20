# Forever 32 Product API

Forever 32 is a mock e-commerce site. For this project I was tasked with designing a backend and replacing a legacy api with a new api that could scale with large amounts of traffic.

# Challenges

- Seeding a database of over 30 million records
- Scaling a server to handle over 5000 RPS
- Learning new technologies such as Docker and AWS (EC2)

# Achievements
- 26ms response time on queries to a MongoDB of 30+ million records
- below 100 ms response time at a throughput of 10k users per second

# Technologies
- Node
- MongoDB
- morgan
- axios
- byline

# Installation

make sure you have MongoDb installed on your local machine

use the package manager npm to install the dependencies

```bash
npm install
```
# Requirements
- Node
- MongoDB
- NPM

# usage

To run this repo you will need to install the dependencies and seed a MongoDB.

```bash
npm run start
```

there are various endpoints you can hit to recieve data from api
