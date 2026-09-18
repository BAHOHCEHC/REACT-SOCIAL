# REACT-SOCIAL
// https://www.youtube.com/watch?v=GOZrjIpRtkI
// use power shell after setup PATH sis variables
docker run --name mongo_social `
  -p 27017:27017 `
  -e MONGO_INITDB_ROOT_USERNAME="admin" `
  -e MONGO_INITDB_ROOT_PASSWORD="admin" `
  -d prismagraphql/mongo-single-replica:5.0.3

// Run the API container with the database settings.
// `localhost` inside the API container is not the host machine, so use
// `host.docker.internal` for the MongoDB container published on port 27017.
docker rm -f express-api
docker run --name express-api `
  -p 3000:3000 `
  -e DATABASE_URL="mongodb://admin:admin@host.docker.internal:27017/react_social?authSource=admin&directConnection=true" `
  -e JWT_SECRET="secret_key" `
  -d express-server

// API: http://localhost:3000
// Prisma Studio (run locally with DATABASE_URL from .env): npx prisma studio