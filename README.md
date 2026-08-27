# REACT-SOCIAL
// https://www.youtube.com/watch?v=GOZrjIpRtkI
// use power shell after setup PATH sis variables
docker run --name mongo_social `
  -p 27017:27017 `
  -e MONGO_INITDB_ROOT_USERNAME="admin" `
  -e MONGO_INITDB_ROOT_PASSWORD="admin" `
  -d prismagraphql/mongo-single-replica:5.0.3

  //npx prisma studio