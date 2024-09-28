export function setFlowerForWordLength(wordLength) {
  let flower;
  switch (wordLength) {
    case 0:
      flower = null;
      break;
    case 1:
      flower = "/flowersprites/seed.png";
      break;
    case 2:
      flower = "/flowersprites/sprout.png";
      break;
    case 3:
      flower = "/flowersprites/grass.png";
      break;
    case 4:
      flower = "/flowersprites/dandelion.png";
      break;
    case 5:
      flower = "/flowersprites/daisy.png";
      break;
    case 6:
      flower = "/flowersprites/lily.jpeg";
      break;
    case 7:
      flower = "/flowersprites/tulip.png";
      break;
    case 8:
      flower = "/flowersprites/sunflower.png";
      break;
    case 9:
      flower = "/flowersprites/azalea.png";
      break;
    case 10:
      flower = "/flowersprites/rose.jpeg";
      break;
    case 11:
      flower = "/flowersprites/orchid.png";
      break;
    case 12:
      flower = "/flowersprites/goldenrose.png";
      break;
    default:
      flower = "/flowersprites/goldenrose.png";
      break;
  }
  return flower;
}
