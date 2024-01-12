import { Database, set, ref, update, onValue, push, child, remove } from '@angular/fire/database';

let db: any;
//  ** Basic CURD **

//  ** Write/update  **
set(ref(db, 'player/001'), {
    'name': 'tayyab',
    'email': 'text@test.com'
});

 
//  ** Read **
const path = ref(db, 'player');
onValue(path, (snapshot) => {
    let readData = snapshot.val();
    console.log(readData);
});

//  ** Update   **

update(ref(db, 'player/001'), {
    'name': 'xxxx',
    'email': 'text@dummy.com'
});


//  **Delete
remove(ref(db, 'player/001'));

// New sample post data with new rec
// const postData = {
//   author: 'username',
//   title: 'title',
//   starCount: 0,
//   authorPic: 'picture'
// };
// generate new unique key
//  const newPostKey = push(child(ref(db), 'posts/')).key;
//  const updates: any = {};
//  updates['/posts/001' + newPostKey] = postData;
//can have multiple updates []
//Writes multiple values to the Database at once.
//  update(ref(db), updates);


//   ---------------------------------------------------------
//                      Sorting
//   ---------------------------------------------------------
// orderByChild()	Order results by the value of a specified child key or nested child path.
// orderByKey()	    Order results by child keys.
// orderByValue()	Order results by child values.

//      **Eg    **
// const topUserPostsRef = query(ref(db, 'user-posts/' + myUserId), orderByChild('starCount'));

//   ---------------------------------------------------------
//                      Filtering
//   ---------------------------------------------------------
// limitToFirst()	Sets the maximum number of items to return from the beginning of the ordered list of results.
// limitToLast()	Sets the maximum number of items to return from the end of the ordered list of results.
// startAt()	    Return items greater than or equal to the specified key or value, depending on the order-by method chosen.
// startAfter()	    Return items greater than the specified key or value depending on the order-by method chosen.
// endAt()	        Return items less than or equal to the specified key or value, depending on the order-by method chosen.
// endBefore()	    Return items less than the specified key or value depending on the order-by method chosen.
// equalTo()	    Return items equal to the specified key or value, depending on the order-by method chosen.


//   ---------------------------------------------------------
//                      Get top
//   ---------------------------------------------------------
// const recentPostsRef = query(ref(db, 'posts'), limitToLast(100));

