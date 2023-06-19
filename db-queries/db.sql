-- Users
create table users (
  id int auto_increment primary key,
  name varchar(255) not null,
  username varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null,
  profile_picture varchar(255),
  role enum('admin', 'editor', 'default') default 'default'
);

-- INSERT INTO Users (name, username, email, password, profile_picture, role)
-- VALUES ('John Doe', 'johndoe', 'johndoe@example.com', 'hashed_password', 'https://picsum.photos/200/200', 'admin');

commit;

-- Categories
create table categories (
  id int auto_increment primary key,
  name varchar(255) not null
);

insert into categories (
  name
) values (
  'Technology'
);

insert into categories (
  name
) values (
  'Fashion'
);

insert into categories (
  name
) values (
  'Travel'
);

insert into categories (
  name
) values (
  'Food'
);

insert into categories (
  name
) values (
  'Sports'
);

-- Posts

create table posts (
  id int auto_increment primary key,
  title varchar(255) not null,
  slug varchar(255) not null,
  content text not null,
  published_at datetime,
  user_id int,
  category_id int,
  banner_img varchar(255),
  foreign key (user_id) references users(id),
  foreign key (category_id) references categories(id)
);

-- insert into posts (
--   title,
--   slug,
--   content,
--   published_at,
--   user_id,
--   category_id,
--   banner_img
-- ) values (
--   'Sample Post',
--   'sample-post-1',
--   'This is a sample post content.',
--   now(),
--   1,
--   1,
--   'https://picsum.photos/200/500/'
-- );

-- insert into posts (
--   title,
--   slug,
--   content,
--   published_at,
--   user_id,
--   category_id,
--   banner_img
-- ) values (
--   'Sample Post 2',
--   'sample-post-2',
--   'This is a sample post content.',
--   now(),
--   1,
--   1,
--   'https://picsum.photos/200/500/'
-- );

-- insert into posts (
--   title,
--   slug,
--   content,
--   published_at,
--   user_id,
--   category_id,
--   banner_img
-- ) values (
--   'Sample Post 3',
--   'sample-post-3',
--   'This is a sample post content.',
--   now(),
--   1,
--   1,
--   'https://picsum.photos/200/500/'
-- );

-- Comments
create table comments (
  id int auto_increment primary key,
  content text not null,
  posted_at datetime,
  user_id int,
  post_id int,
  foreign key (user_id) references users(id),
  foreign key (post_id) references posts(id)
);

-- insert into comments (
--   content,
--   posted_at,
--   user_id,
--   post_id
-- ) values (
--   'This is a sample comment by User 1 on Post 1.',
--   now(),
--   1,
--   1
-- );

commit;

-- Likes
create table likes (
  id int auto_increment primary key,
  user_id int,
  post_id int,
  foreign key (user_id) references users(id),
  foreign key (post_id) references posts(id)
);

-- insert into likes (
--   user_id,
--   post_id
-- ) values (
--   1,
--   1
-- );