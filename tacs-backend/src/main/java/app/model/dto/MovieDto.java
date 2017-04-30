package app.model.dto;

import java.util.ArrayList;
import java.util.List;

public class MovieDto {

	private String title;

	private String year;

	private List<ActorDto> actors = new ArrayList<ActorDto>(0);

	public MovieDto(String title, String year) {
		this.title = title;
		this.year = year;
	}

	public MovieDto() {

	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public List<ActorDto> getActors() {
		return actors;
	}

	public void setActors(List<ActorDto> actors) {
		this.actors = actors;
	}

	public void addActor(ActorDto actor) {
		this.actors.add(actor);
	}

}
