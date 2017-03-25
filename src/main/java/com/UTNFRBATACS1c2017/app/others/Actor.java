/**
 * 
 */
package com.UTNFRBATACS1c2017.app.others;

import java.util.List;

/**
 * @author facundo91
 *
 */
public class Actor {
	private int id;
	private String name;
	private List<Image> profiles;
	private List<Credit> credits;

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
	 * @return the name
	 */
	private String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	private void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the profiles
	 */
	private List<Image> getProfiles() {
		return profiles;
	}

	/**
	 * @param profiles the profiles to set
	 */
	private void setProfiles(List<Image> profiles) {
		this.profiles = profiles;
	}

	/**
	 * @return the credits
	 */
	private List<Credit> getCredits() {
		return credits;
	}

	/**
	 * @param credits the credits to set
	 */
	private void setCredits(List<Credit> credits) {
		this.credits = credits;
	}

	public void showDetails() {
		// TODO Auto-generated method stub

	}
}
