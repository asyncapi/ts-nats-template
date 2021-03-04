class anonymSchema1 {
  private lumen: number;

  constructor(input: anonymSchema1Input) {
    this.lumen = input.lumen;
  }

  get lumen(): number { return this.lumen; }
  set lumen(lumen: number) { this.lumen = lumen; }
}