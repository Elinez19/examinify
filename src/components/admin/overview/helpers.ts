export function resolveCategoryArtwork(slugOrTitle: string): string {
  const key = slugOrTitle.toLowerCase();
  if (key.includes("math") || key.includes("calc") || key.includes("ac") || key.includes("refrig")) {
    return "/images/landing/cbt-maths.jpg";
  }
  if (key.includes("prim") || key.includes("basic") || key.includes("plumb") || key.includes("pipe")) {
    return "/images/landing/cbt-primary.svg";
  }
  if (key.includes("eng") || key.includes("term") || key.includes("carpent") || key.includes("wood")) {
    return "/images/landing/cbt-termly-exams.svg";
  }
  if (key.includes("ict") || key.includes("comp") || key.includes("phys") || key.includes("electr") || key.includes("solar") || key.includes("inverter")) {
    return "/images/landing/cbt-security.svg";
  }
  if (key.includes("sec") || key.includes("chem") || key.includes("bio") || key.includes("clean") || key.includes("fumig")) {
    return "/images/landing/cbt-secondary.svg";
  }
  return "/images/landing/cbt-broadsheets.svg";
}

