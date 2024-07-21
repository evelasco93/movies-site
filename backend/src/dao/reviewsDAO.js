import { ObjectId } from "mongodb";

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db("movies").collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addReview(movieId, user, review) {
    try {
      const currentDate = new Date();
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = currentDate.toLocaleDateString("en-US", options);
      const reviewDoc = {
        movieId: movieId,
        user: user,
        review: encodeURIComponent(review),
        date: formattedDate,
      };
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Error adding review: ${e}`);
      return { error: e };
    }
  }

  static async getReview(reviewId) {
    try {
      return await reviews.findOne({ _id: new ObjectId(reviewId) });
    } catch (e) {
      console.error(`Error getting review: ${e}`);
      return { error: e };
    }
  }

  static async updateReview(reviewId, user, review) {
    try {
      const currentDate = new Date();
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = currentDate.toLocaleDateString("en-US", options);
      return await reviews.updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: { user: user, review: encodeURIComponent(review), date: formattedDate } }
      );
    } catch (e) {
      console.error(`Error updating review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId) {
    try {
      return await reviews.deleteOne({ _id: new ObjectId(reviewId) });
    } catch (e) {
      console.error(`Error deleting review: ${e}`);
      return { error: e };
    }
  }

  static async getReviewsByMovieId(movieId) {
    try {
      return (await reviews.find({ movieId: parseInt(movieId) })).toArray();
    } catch (e) {
      console.error(`Error getting reviews by movieId: ${e}`);
      return { error: e };
    }
  }
}
