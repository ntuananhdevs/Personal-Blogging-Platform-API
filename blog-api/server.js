const fastify = require('fastify')({ logger: true });

// Kết nối MongoDB
fastify.register(require('fastify-mongodb'), {
  forceClose: true,
  url: 'mongodb://localhost:27017/blog'
});

// Định nghĩa các endpoint CRUD

// Lấy danh sách bài viết
fastify.get('/posts', async (request, reply) => {
  const collection = fastify.mongo.db.collection('posts');
  const posts = await collection.find().toArray();
  return posts;
});

// Lấy một bài viết theo ID
fastify.get('/posts/:id', async (request, reply) => {
  const { id } = request.params;
  const collection = fastify.mongo.db.collection('posts');
  const post = await collection.findOne({ _id: new fastify.mongo.ObjectId(id) });
  return post;
});

// Tạo bài viết mới
fastify.post('/posts', async (request, reply) => {
  const collection = fastify.mongo.db.collection('posts');
  const result = await collection.insertOne(request.body);
  return result.ops[0];
});

// Cập nhật bài viết theo ID
fastify.put('/posts/:id', async (request, reply) => {
  const { id } = request.params;
  const collection = fastify.mongo.db.collection('posts');
  await collection.updateOne({ _id: new fastify.mongo.ObjectId(id) }, { $set: request.body });
  return { message: 'Post updated successfully' };
});

// Xóa bài viết theo ID
fastify.delete('/posts/:id', async (request, reply) => {
  const { id } = request.params;
  const collection = fastify.mongo.db.collection('posts');
  await collection.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
  return { message: 'Post deleted successfully' };
});

// Khởi động máy chủ
fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server đang chạy tại ${address}`);
});
