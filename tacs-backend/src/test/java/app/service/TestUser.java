package app.service;

public class TestUser{

//	TODO: arreglar test.
//	@MockBean
//	UserService servicioUsuario;
//
//	@MockBean
//	AdministrativoService adminService ;
//
//
//	@Before
//	public void setUp(){}
//
//	@Test
//	public void testBusquedaUsuario() {
//		List<Movie> pelis = new ArrayList<Movie>();
//		List<MovieList> listas = new ArrayList<MovieList>();
//		pelis.add(Movie.create(150,"Matrix"));
//		listas.add(MovieList.create("Lista 1", pelis));
//		listas.add(MovieList.create("Lista 2", pelis));
//		User usuario = User.create(Credencial.create("Carlos","123"), false);
//		servicioUsuario.crearNuevoUsuario(Credencial.create("Carlos","123"));
//		Assert.assertTrue(servicioUsuario.obtenerUsuarios().get(0).getId()==usuario.getId());
//	}
//
//	@Test(expected=RuntimeException.class)
//	public void testBusquedaUsuarioInexistente() {
//		adminService.obtenerUsuario("0");
//	}
//
//	@Test
//	public void testInterseccionListasUsuario(){
//		List<Movie> pelis1 = new ArrayList<Movie>();
//		List<Movie> pelis2 = new ArrayList<Movie>();
//		List<MovieList> listas1 = new ArrayList<MovieList>();
//		List<MovieList> listas2 = new ArrayList<MovieList>();
//		pelis1.add(Movie.create(150,"Matrix"));
//		pelis1.add(Movie.create(100,"Star Wars"));
//		pelis2.add(Movie.create(50,"Toy Story"));
//		pelis2.add(Movie.create(100,"Star Wars"));
//		MovieList lista1 = MovieList.create("Lista 1", pelis1);
//		listas1.add(lista1);
//		RepositorioDeListas.getInstance().insert(lista1);
//		MovieList lista2 = MovieList.create("Lista 2", pelis2);
//		listas2.add(lista2);
//		RepositorioDeListas.getInstance().insert(lista2);
//
//		User usuario1 = User.create(Credencial.create("Carlos","124"),false);
//		usuario1.setId("100");
//		usuario1.setLists(listas1);
//
//		User usuario2 = User.create(Credencial.create("Carlos2","123"),false);
//		usuario2.setId("50");
//		usuario2.setLists(listas2);
//
//		Integer lista1Id = usuario1.getLists().get(0).getId();
//		Integer lista2Id = usuario2.getLists().get(0).getId();
//
//		servicioUsuario.crearNuevoUsuario(Credencial.create("Carlos","124"));
//		servicioUsuario.crearNuevoUsuario(Credencial.create("Carlos2","123"));
//
//		List<Movie> interseccion = new ArrayList<Movie>();
//		interseccion.add(Movie.create(100,"Star Wars"));
//		Assert.assertEquals(adminService.obtenerInterseccionListas(lista1Id.toString(), lista2Id.toString()),interseccion);
//	}
//
//	@Test
//	public void testRankingFavoritos() throws IOException{
//		User usuario1 = User.create(Credencial.create("Carlos","124"),false);
//		usuario1.setId("100");
//		servicioUsuario.crearNuevoUsuario(Credencial.create("Carlos","124"));
//		User usuario2 = User.create(Credencial.create("Carlos2","123"),false);
//		usuario2.setId("50");
//		servicioUsuario.crearNuevoUsuario(Credencial.create("Carlos2","123"));
//		User usuario3 = User.create(Credencial.create("Carlos3","123"),false);
//		usuario3.setId("5");
//		servicioUsuario.crearNuevoUsuario(Credencial.create("Carlos3","123"));
//		Actor actor1 = new Actor();
//		actor1.setId(100);
//		actor1.setName("John");
//		Actor actor2 = new Actor();
//		actor2.setId(200);
//		actor2.setName("Mark");
//		Actor actor3 = new Actor();
//		actor3.setId(300);
//		actor3.setName("Bruce");
//		Actor actor4 = new Actor();
//		actor4.setId(500);
//		actor4.setName("Julie");
//		Actor actor5 = new Actor();
//		actor5.setId(50);
//		actor5.setName("Tom");
//		usuario1.getFavoriteActors().add(actor1);
//		usuario1.getFavoriteActors().add(actor2);
//		usuario1.getFavoriteActors().add(actor3);
//		usuario2.getFavoriteActors().add(actor3);
//		usuario2.getFavoriteActors().add(actor4);
//		usuario2.getFavoriteActors().add(actor5);
//		usuario3.getFavoriteActors().add(actor1);
//		usuario3.getFavoriteActors().add(actor3);
//		usuario3.getFavoriteActors().add(actor5);
//		Assert.assertTrue(servicioUsuario.verRankingActoresFavoritos(null).get(0)==actor3);
//
//	}
//
//	@After
//	public void repoReset(){
//		servicioUsuario.borrarTodo();
//	}
}
