/**
 * 
 */
package com.UTNFRBATACS1c2017.app.others;

import org.json.JSONObject;

/**
 * @author facundo91
 *
 */
public class Review {
	private int id;
	private String reviewId; // just colled results.id by the TMDb API
	private int movieId; // just colled id by the TMDb API
	private String author;
	private String content;
	private String url;
	
	/**
	 * @return the id
	 */
	private int getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	private void setId(int id) {
		this.id = id;
	}

	/**
	 * @return the review_id
	 */
	public String getReviewId() {
		return reviewId;
	}

	/**
	 * @param review_id the reviewId to set
	 */
	private void setReviewId(String reviewId) {
		this.reviewId = reviewId;
	}

	/**
	 * @return the movie_id
	 */
	private int getMovieId() {
		return movieId;
	}

	/**
	 * @param movieId the movieId to set
	 */
	private void setMovieId(int movieId) {
		this.movieId = movieId;
	}

	/**
	 * @return the author
	 */
	public String getAuthor() {
		return author;
	}

	/**
	 * @param author the author to set
	 */
	private void setAuthor(String author) {
		this.author = author;
	}

	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}

	/**
	 * @param content the content to set
	 */
	private void setContent(String content) {
		this.content = content;
	}

	/**
	 * @return the url
	 */
	private String getUrl() {
		return url;
	}

	/**
	 * @param url the url to set
	 */
	private void setUrl(String url) {
		this.url = url;
	}

	public Review(JSONObject jsonReview, Movie movie) {
		this.setMovieId(movie.getId());
		this.setReviewId(jsonReview.getString("id"));
		this.setAuthor(jsonReview.getString("author"));
		this.setContent(jsonReview.getString("content"));
		this.setUrl(jsonReview.getString("url"));
	}
	
}
