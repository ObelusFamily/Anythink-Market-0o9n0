var mongoose = require("mongoose");

if (!process.env.MONGODB_URI) {
    console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}
(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    //mongoose.set("debug", true);
    require("./models/User");
    require("./models/Item");
    require("./models/Comment");

    var User = mongoose.model("User");
    let allUsers = await User.find({}).exec();
    console.log('all users', allUsers.length);
    if (allUsers.length < 100) {
        for (let i = allUsers.length; i < 100; i++) {
            console.log('> creating user', i);
            var user = new User();
            user.username = `username${i}`;
            user.email = `username${i}-email@gmail.com`;
            user.setPassword(`password-${i}`);
            await user.save()
        }
    }
    allUsers = await User.find({}).exec();

    var Item = mongoose.model("Item");
    const allItems = await Item.find({});
    console.log('all items', allItems.length);
    if (allItems.length < 100) {
        for (let i = allItems.length; i < 100; i++) {
            console.log('> creating item', i);
            var item = new Item();
            item.slug = `item-slug-${i}`;
            item.description = `item-desc-${i}`;
            item.title = `item-title-${i}`;
            item.seller = allUsers[i];
            item.tagList = [`tag-${i}`, 'seed'];
            await item.save();
        }
    }

    var Comment = mongoose.model("Comment");
    const allComments = await Comment.find({});
    console.log('all comments', allComments.length);
    if (allComments.length < 100) {
        for (let i = allComments.length; i < 100; i++) {
            console.log('> creating comment', i);
            var comment = new Comment();
            comment.body = `comment ${i} body`;
            comment.seller = allUsers[i];
            await comment.save();
        }
    }
    console.log('------------- finished!');
    await mongoose.disconnect();
    process.exit(1);
})()

