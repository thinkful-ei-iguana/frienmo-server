const xss = require('xss');
const FavorService = {
  insertFavor(db, newFavor) {
    return db
      .insert(newFavor)
      .into('favor')
      .returning('*')
      .first();
  },
  serializeFavor(favor) {
    return {
      creator_id: favor.creator_id,
      title: xss(favor.title),
      category: favor.category,
      publicity: favor.publicity,
      description: xss(
        favor.description
      ),
      user_location: xss(
        favor.user_location
      ),
      tag: xss(favor.tag),
      limit: favor.limit
    };
  },
  getAllFavors(
    db,
    productsPerPage,
    page
  ) {
    const offset =
      productsPerPage * (page - 1);
    return db('outstanding')
      .join(
        'favor as fa',
        'fa.id',
        '=',
        'o.favor_id'
      )
      .join(
        'user as creator',
        'user.id',
        '=',
        'favor.creator_id'
      )
      .where(
        'fa.publicity',
        '=',
        'public'
      )
      .join(
        'users as receiver',
        'receiver.id',
        '=',
        'o.receiver_id'
      )
      .join(
        'users as issuer',
        'o.user_id',
        '=',
        'issuer.id'
      )
      .orderBy('posted', 'desc')
      .select(
        'fa.id as favor_id',
        'fa.title as title',
        'fa.description as description',
        'fa.category as category',
        'fa.expiration_date as expiration_date',
        'fa.publicity as publicity',
        'fa.location as location',
        'fa.tag as tag',
        'fa.limit as limit',
        'o.id as outstanding_id',
        'creator.id as creator_id',
        'creator.name as creator_name',
        'creator.username as creator_username',
        'issuer.id as issuer_id',
        'issuer.name as issuer_name',
        'issuer.username as issuer_username',
        'receiver.id as receiver_id',
        'receiver.name as receiver_name',
        'receiver.username as receiver_username'
      )
      .limit(productsPerPage)
      .offset(offset);
  },
  getFavorById(db, id) {
    // db
    //   .select('*')
    //   .from('favor')
    //   .where('id', id)
    //   .first(); //excludes personal

    return db('outstanding as o')
      .join(
        'favor as fa',
        'fa.id',
        '=',
        'o.favor_id'
      )
      .join(
        'user as creator',
        'user.id',
        '=',
        'favor.creator_id'
      )
      .where('fa.id', '=', id)
      .join(
        'users as receiver',
        'receiver.id',
        '=',
        'o.receiver_id'
      )
      .join(
        'users as issuer',
        'o.user_id',
        '=',
        'issuer.id'
      )
      .select(
        'fa.id as favor_id',
        'fa.title as title',
        'fa.description as description',
        'fa.category as category',
        'fa.expiration_date as expiration_date',
        'fa.publicity as publicity',
        'fa.location as location',
        'fa.tag as tag',
        'fa.limit as limit',
        'o.id as outstanding_id',
        'creator.id as creator_id',
        'creator.name as creator_name',
        'creator.username as creator_username',
        'issuer.id as issuer_id',
        'issuer.name as issuer_name',
        'issuer.username as issuer_username',
        'receiver.id as receiver_id',
        'receiver.name as receiver_name',
        'receiver.username as receiver_username'
      )
      .first();
  },
  getFavorByFriends(
    db,
    user_id,
    productsPerPage,
    page
  ) {
    //excludes personal
    const offset =
      productsPerPage * (page - 1);

    return db('outstanding as o')
      .join(
        'favor as fa',
        'fa.id',
        '=',
        'o.favor_id'
      )
      .join(
        'user as creator',
        'user.id',
        '=',
        'favor.creator_id'
      )
      .where(
        'fa.publicity',
        '=',
        'friends'
      )
      .join('friend as fr', function() {
        this.on(
          'fr.user_id',
          '=',
          'o.users_id'
        ).orOn(
          'fr.friend_id',
          '=',
          'o.receiver_id'
        );
      })
      .where(function() {
        this.where(
          'fr.user_id',
          '=',
          user_id
        ).orWhere(
          'fr.friend_id',
          '=',
          user_id
        );
      })
      .join(
        'users as receiver',
        'receiver.id',
        '=',
        'o.receiver_id'
      )
      .join(
        'users as issuer',
        'o.user_id',
        '=',
        'issuer.id'
      )
      .select(
        'fa.id as favor_id',
        'fa.title as title',
        'fa.description as description',
        'fa.category as category',
        'fa.expiration_date as expiration_date',
        'fa.publicity as publicity',
        'fa.location as location',
        'fa.tag as tag',
        'fa.limit as limit',
        'o.id as outstanding_id',
        'creator.id as creator_id',
        'creator.name as creator_name',
        'creator.username as creator_username',
        'issuer.id as issuer_id',
        'issuer.name as issuer_name',
        'issuer.username as issuer_username',
        'receiver.id as receiver_id',
        'receiver.name as receiver_name',
        'receiver.username as receiver_username'
      )
      .limit(productsPerPage)
      .offset(offset);
  },
  getPersonalFavors(
    db,
    user_id,
    productsPerPage,
    page
  ) {
    const offset =
      productsPerPage * (page - 1);
    return db('outstanding as o')
      .join(
        'favor as fa',
        'fa.id',
        '=',
        'o.favor_id'
      )
      .join(
        'user as creator',
        'user.id',
        '=',
        'favor.creator_id'
      )
      .where('fa.publicity', '=', 'dm')
      .join('friend as fr', function() {
        this.on(
          'fr.user_id',
          '=',
          'o.users_id'
        ).orOn(
          'fr.friend_id',
          '=',
          'o.receiver_id'
        );
      })
      .where(function() {
        this.where(
          'fr.user_id',
          '=',
          user_id
        ).orWhere(
          'fr.friend_id',
          '=',
          user_id
        );
      })
      .join(
        'users as receiver',
        'receiver.id',
        '=',
        'o.receiver_id'
      )
      .join(
        'users as issuer',
        'o.user_id',
        '=',
        'issuer.id'
      )
      .select(
        'fa.id as favor_id',
        'fa.title as title',
        'fa.description as description',
        'fa.category as category',
        'fa.expiration_date as expiration_date',
        'fa.publicity as publicity',
        'fa.location as location',
        'fa.tag as tag',
        'fa.limit as limit',
        'o.id as outstanding_id',
        'creator.id as creator_id',
        'creator.name as creator_name',
        'creator.username as creator_username',
        'issuer.id as issuer_id',
        'issuer.name as issuer_name',
        'issuer.username as issuer_username',
        'receiver.id as receiver_id',
        'receiver.name as receiver_name',
        'receiver.username as receiver_username'
      )
      .limit(productsPerPage)
      .offset(offset);
  },
  updateFavor(db, id, newFavorFields) {
    return db('favor')
      .where({ id })
      .update(newFavorFields);
  },
  deleteFavor(db, id) {
    return db('favor')
      .where({ id })
      .delete();
  },
  getOutstanding(db, favor_id) {
    return db('outstanding')
      .where({
        favor_id
      })
      .select('*');
  },
  redeem(
    db,
    outstanding_id,
    confirmation
  ) {
    return db('outstanding')
      .where({ outstanding_id })
      .update(confirmation);
  },
  insertOutstanding(
    db,
    newOutstanding
  ) {
    return db
      .insert(newOutstanding)
      .into('outstanding')
      .returning('*')
      .first();
  },
  getPublicFavors(
    db,
    user_id,
    productsPerPage,
    page
  ) {
    const offset =
      productsPerPage * (page - 1);
    return db('outstanding')
      .join(
        'favor as fa',
        'fa.id',
        '=',
        'o.favor_id'
      )
      .join(
        'user as creator',
        'user.id',
        '=',
        'favor.creator_id'
      )
      .where(
        'fa.publicity',
        '=',
        'public'
      )
      .join('friend as fr', function() {
        this.on(
          'fr.user_id',
          '=',
          'o.users_id'
        ).orOn(
          'fr.friend_id',
          '=',
          'o.receiver_id'
        );
      })
      .where(function() {
        this.where(
          'fr.user_id',
          '=',
          user_id
        ).orWhere(
          'fr.friend_id',
          '=',
          user_id
        );
      })
      .join(
        'users as receiver',
        'receiver.id',
        '=',
        'o.receiver_id'
      )
      .join(
        'users as issuer',
        'o.user_id',
        '=',
        'issuer.id'
      )
      .orderBy('posted', 'desc')
      .select(
        'fa.id as favor_id',
        'fa.title as title',
        'fa.description as description',
        'fa.category as category',
        'fa.expiration_date as expiration_date',
        'fa.publicity as publicity',
        'fa.location as location',
        'fa.tag as tag',
        'fa.limit as limit',
        'o.id as outstanding_id',
        'creator.id as creator_id',
        'creator.name as creator_name',
        'creator.username as creator_username',
        'issuer.id as issuer_id',
        'issuer.name as issuer_name',
        'issuer.username as issuer_username',
        'receiver.id as receiver_id',
        'receiver.name as receiver_name',
        'receiver.username as receiver_username'
      )
      .limit(productsPerPage)
      .offset(offset);
  }
};

module.exports = FavorService;
