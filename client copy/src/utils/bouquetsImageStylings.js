export function bouquetsImageStylings(wordAmount, word) {
  if (wordAmount == 2) {
    if (word == 0) {
      return "md:-mr-4 -mr-6 z-10";
    }
    if (word == 1) {
      return "md:-ml-6 -ml-4 z-10";
    }
  }
  if (wordAmount == 3) {
    if (word == 0) {
      return "md:-mr-6 -mr-7 z-10 hover:z-20";
    }
    if (word == 1) {
      return "z-10";
    }
    if (word == 2) {
      return "md:-ml-6 -ml-7 z-10 hover:z-20";
    }
  }
  if (wordAmount == 4) {
    if (word == 0) {
      return "md:-mr-6 -mr-7 z-0 z-10 hover:z-20";
    }
    if (word == 1) {
      return "md:-mr-2 -mr-4 z-10";
    }
    if (word == 2) {
      return "md:-ml-4 -ml-6 z-10 ";
    }
    if (word == 3) {
      return "md:-ml-4 -ml-6 z-0 hover:z-20";
    }
  }
  if (wordAmount == 5) {
    if (word == 0) {
      return "md:-mr-4 -mr-7 z-0 hover:z-30";
    }
    if (word == 1) {
      return "md:-mr-4 -mr-7 z-10 hover:z-30";
    }
    if (word == 2) {
      return "z-20";
    }
    if (word == 3) {
      return "md:-ml-4 -ml-7 z-10 hover:z-30";
    }
    if (word == 4) {
      return "md:-ml-4 -ml-7 z-0 hover:z-30";
    }
  }
  if (wordAmount == 6) {
    if (word == 0) {
      return "md:-mr-4 -mr-7 z-0 hover:z-30";
    }
    if (word == 1) {
      return "md:-mr-4 -mr-7 z-10 hover:z-30";
    }
    if (word == 2) {
      return "md:-mr-2 -mr-3 z-20";
    }
    if (word == 3) {
      return "md:-ml-2 -ml-4 z-20";
    }
    if (word == 4) {
      return "md:-ml-4 -ml-7 z-10 hover:z-30";
    }
    if (word == 5) {
      return "md:-ml-4 -ml-7 z-0 hover:z-30";
    }
  }
  if (wordAmount == 7) {
    if (word == 0) {
      return "md:-mr-4 -mr-7 z-0 z-0 hover:z-40";
    }
    if (word == 1) {
      return "md:-mr-4 -mr-7  z-10 hover:z-40";
    }
    if (word == 2) {
      return "md:-mr-4 -mr-7  z-20 hover:z-40";
    }
    if (word == 3) {
      return "z-30";
    }
    if (word == 4) {
      return "md:-ml-4 -ml-7  z-20 hover:z-40";
    }
    if (word == 5) {
      return "md:-ml-4 -ml-7  z-10 hover:z-40";
    }
    if (word == 6) {
      return "md:-ml-4 -ml-7  z-0 hover:z-40";
    }
  }
  if (wordAmount == 8) {
    if (word == 0) {
      return "md:-mr-4 -mr-7 z-0 z-0 hover:z-40";
    }
    if (word == 1) {
      return "md:-mr-4 -mr-7  z-10 hover:z-40";
    }
    if (word == 2) {
      return "md:-mr-4 -mr-7  z-20 hover:z-40";
    }
    if (word == 3) {
      return "md:-mr-2 -mr-3 z-30 hover:z-40";
    }
    if (word == 4) {
      return "md:-ml-2 -ml-4 z-30 hover:z-40";
    }
    if (word == 5) {
      return "md:-ml-4 -ml-7 z-20 hover:z-40";
    }
    if (word == 6) {
      return "md:-ml-4 -ml-7 z-10 hover:z-40";
    }
    if (word == 7) {
      return "md:-ml-4 -ml-7 z-0 hover:z-40";
    }
  }
  if (wordAmount == 9) {
    if (word == 0) {
      return "md:-mr-4 -mr-7 z-0 hover:z-50";
    }
    if (word == 1) {
      return "md:-mr-4 -mr-7 z-10 hover:z-50";
    }
    if (word == 2) {
      return "md:-mr-4 -mr-7 z-20 hover:z-50";
    }
    if (word == 3) {
      return "md:-mr-4 -mr-7 z-30 hover:z-50";
    }
    if (word == 4) {
      return "z-40 hover:z-50";
    }
    if (word == 5) {
      return "md:-ml-4 -ml-7 z-30 hover:z-50";
    }
    if (word == 6) {
      return "md:-ml-4 -ml-7 z-20 hover:z-50";
    }
    if (word == 7) {
      return "md:-ml-4 -ml-7 z-10 hover:z-50";
    }
    if (word == 8) {
      return "md:-ml-4 -ml-7 z-0 hover:z-50";
    }
  }
  if (wordAmount == 10) {
    if (word == 0) {
      return "md:-mr-4 -mr-7 z-0 hover:z-50";
    }
    if (word == 1) {
      return "md:-mr-4 -mr-7  z-10 hover:z-50";
    }
    if (word == 2) {
      return "md:-mr-4 -mr-7  z-20 hover:z-50";
    }
    if (word == 3) {
      return "md:-mr-4 -mr-7 z-30 hover:z-50";
    }
    if (word == 4) {
      return "md:-mr-2 -mr-3 z-40 hover:z-50";
    }
    if (word == 5) {
      return "md:-ml-2 -ml-4 z-40 hover:z-50";
    }
    if (word == 6) {
      return "md:-ml-4 -ml-7 z-30 hover:z-50";
    }
    if (word == 7) {
      return "md:-ml-4 -ml-7 z-20 hover:z-50";
    }
    if (word == 8) {
      return "md:-ml-4 -ml-7 z-10 hover:z-50";
    }
    if (word == 9) {
      return "md:-ml-4 -ml-7 z-0 hover:z-50";
    }
  }
}
