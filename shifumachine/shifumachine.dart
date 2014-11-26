import 'a_star_2d.dart';
import 'dart:collection';
import 'dart:math';
import 'dart:js';
import 'dart:html';

final nb_symbole = 3;
Carte carta;
ButtonElement btn;

/* programme principale */
void main() {
  print("Shifumachine Activée");
  
  //création des symboles
  var pierre = new Symbole("pierre", 1);
  var feuille = new Symbole("feuille", 2);
  var ciseau = new Symbole("ciseau", 3);
  
  //test
  shifumi(pierre, ciseau);
  shifumi(pierre, feuille);
  shifumi(pierre, pierre);
  
  String testmap = "____________\n" + 
                   "____________\n" +
                   "xxxxx_xxxxxx\n" +
                   "xxx____xxxxx\n" +
                   "____________";
  
  carta = new Carte.txt (testmap);
  //Carte carta = new Carte.vide (16,24);
  carta.log();
  
  Creature mirmignon = new Creature ('mirmignon', ciseau, feuille, carta);
  mirmignon.deplacer(4, 8);
  Creature thrace = new Creature ('thrace', pierre, pierre, carta);
  thrace.attaquer(mirmignon);
  //mirmignon.deplacer(0, 2);
  mirmignon.attaquer(thrace);
  
  btn = querySelector('#btn');
  btn.onClick.listen(carta.draw);
}

/* classe des symbole, pierre, feuille, ciseau */
class Symbole {
  String nom;
  var valeur;
  
  //constructeur
  Symbole(String _nom, _valeur){
    nom = _nom;
    valeur = _valeur;
  }
  
}

/* résoud un shifumi attaque vs defense retourne un string gagné, égalité ou perdu */
String shifumi (Symbole _atk, Symbole _def){
  //calcul du resultat
  var r = ((_def.valeur - _atk.valeur)+nb_symbole)%nb_symbole;
  print(_atk.nom + " vs. " + _def.nom);
  if (r == 2) {
    print("gagné");
    return "gagné";
  }else if (r == 0){
    print("égalité");
    return "égalité";
  }else{
    print("perdu");
    return "perdu";
  }
}

/* classe créature */
class Creature {
  String nom;
  Symbole attaque;
  Symbole defense;
  int alonge = 1;
  var x = 0;
  var y = 0;
  Carte carte;
  
  //constructeur
  Creature(String _nom, Symbole _atk, Symbole _def, _carte){
    print("Création de " +  _nom + ", attaque : " + _atk.nom + ", defense : " + _def.nom);
    nom = _nom;
    attaque = _atk;
    defense = _def;
    carte = _carte;
    carte.maj(0, 0);
  }
  
  //méthode de déplacement de base
  void deplacer (int _x, int _y){
    if (_x < 0 || _x > carte.hauteur -1 || _y < 0 || _y > carte.largeur -1){
      print("deplacement impossible");
      print("cible : x: $_x vs " + carte.hauteur.toString() +
            " y: $_y vs " + carte.largeur.toString());
    }else {
      carte.maj(x,y);
      Queue path = chemin (this, _x, _y);
      if (path.length != 0){
        print(nom + " se déplace vers $_x, $_y");
        x = _x;
        y = _y;
      }else {
        print("chemin bloqué !");
      }
      carte.maj(x,y);
      carte.log();
    }
  }
  
  //méthode d'attaque
  void attaquer  (Creature _cible){
    if ( max((this.x - _cible.x).abs(), (this.y - _cible.y).abs())  <= alonge){
      print ("$nom attaque " + _cible.nom);
      shifumi(attaque, _cible.defense);
    }else{
      print("cible hors portée");
    }
  }
}

/*pathfinding créature, x, y */
Queue chemin (Creature _o, int _x, int _y){
  _o.carte.plan.start = _o.carte.plan.tiles[_o.x][_o.y];
  _o.carte.plan.goal = _o.carte.plan.tiles[_x][_y];
  Queue<Tile> solution = aStar2D(_o.carte.plan);
  print(solution);
  return solution;
}

/* classe d'une carte */
class Carte {
  int hauteur;
  int largeur;
  Maze plan;
  
  /*constructeur */
  Carte (this.hauteur, this.largeur, this.plan);
  
  /*constructeur d'une carte vide */
  factory Carte.vide(int _h, int _l){
    var r = "";
    for (var i = 0; i < _h; i++){
      for (var j = 0; j < _l; j++){
        r += "_";
      }
      r += "\n";
    }
    Maze _plan = new Maze.parse(r);
    print('carte vide créée');
    return new Carte(_h, _l, _plan);
  }
  
  /* creer une carte a partir d'une String */
  factory Carte.txt(String _txt){
      Maze _plan = new Maze.parse(_txt);        
      return new Carte( _plan.tiles.length, _plan.tiles[0].length, _plan);
  }
  
  /* inverse obstacle d'une tile */
  void maj (int _x, int _y){
    plan.tiles[_x][_y].obstacle = ! plan.tiles[_x][_y].obstacle;
  }
  
  
  /* methode pour renvoyer en texte yo ! */
  String log (){
    var r = "";
    print('Carte : ');
    for (var i = 0; i < plan.tiles.length; i++){
      for (var j = 0; j < plan.tiles[0].length; j++){
        if (plan.tiles[i][j].obstacle){
          r += 'x';
        }else{
          r += '_';
        }
      }
      r += '\n';
    }
    print(r);
    return r;
  }
  
  void draw(Event e){
    print('draw !');
    context.callMethod('drawmap', [log()]);
  }
}