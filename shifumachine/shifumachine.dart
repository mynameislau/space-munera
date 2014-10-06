//import 'dart:io';
import 'a_star_2d.dart';
import 'dart:collection';

final nb_symbole = 3;

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
  
  String testmap = "______\n______\nxxxxxx\nxxx___\n______";
  
  Carte carta = new Carte.txt (testmap);
  //Carte carta = new Carte.vide (10,10);
  carta.log();
  
  Creature mirmignon = new Creature ('mirmignon', ciseau, feuille, carta);
  mirmignon.deplacer(4, 4);
  Creature thrace = new Creature ('thrace', pierre, pierre, carta);
  thrace.attaquer(mirmignon);
  
  /*
  do {
    var com = stdin.readLineSync();
    print(com);
    if (com == 'q'){
      break;
    }
  }while(true);
  * 
   */
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
  }
  
  //méthode de déplacement de base
  void deplacer (int _x, int _y){
    if (_x < 0 || _x > carte.largeur -1 || _y < 0 || _y > carte.hauteur -1 || carte.plan[_x][_y] == 'X'){
      print("deplacement impossible");
    }else {
      Queue path = chemin (this, _x, _y);
      if (path.length != 0){
        print(nom + " se déplace vers $_x, $_y");
        x = _x;
        y = _y;
        carte.log();
      }else {
        print("chemin bloqué !");
      }
    }
  }
  
  //méthode d'attaque
  void attaquer  (Creature _cible){
    print ("$nom attaque " + _cible.nom);
    shifumi(attaque, _cible.defense);
  }
}

/*pathfinding carte, créature, x, y */
Queue chemin (Creature _o, int _x, int _y){
  _o.carte.plan[_o.x][_o.y]= 's';
  _o.carte.plan[_x][_y]= 'g';
  Maze maze = new Maze.parse(_o.carte.log());
  Queue<Tile> solution = aStar2D(maze);
  _o.carte.plan[_o.x][_o.y]= '_';
  _o.carte.plan[_x][_y]= 'z';
  //print(solution);
  return solution;
}

/* classe d'une carte */
class Carte {
  int hauteur;
  int largeur;
  List plan;
  
  //constructeur
  Carte (this.hauteur, this.largeur, this.plan);
  
  //constructeur d'une carte vide
  factory Carte.vide(int _h, int _l){
    List _plan = new List(_l);
    for (var x = 0; x < _l; x++){
      _plan[x] = new List(_h);
      for (var y = 0; y < _h; y++){
        _plan[x][y] = '_';
      }
    }
    print('carte vide créée');
    return new Carte(_h, _l, _plan);
  }
  
  factory Carte.txt(String _txt){
    List<List<String>> _plan = <List<String>>[];
    List rows = _txt.trim().split('\n');
        
        for (var rowNum = 0; rowNum < rows.length; rowNum++) {
          var row = new List<String>();
          var ligne = rows[rowNum].trim().split("");
          
          for (var colNum = 0; colNum < ligne.length; colNum++) {
            var t = ligne[colNum];
            row.add(t);
          }
          
          _plan.add(row);
        }
        
      return new Carte(rows.length, rows[0].length, _plan);
  }
  
  
  /* methode pour renvoyer en texte yo ! */
  String log (){
    var r = "";
    print('Carte : ');
    for (var y = 0; y < plan.length; y++){
      r += plan[y].join('');
      r += '\n';
    }
    print(r);
    return r;
  }
}