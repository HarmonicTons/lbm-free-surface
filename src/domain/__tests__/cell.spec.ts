import { sum } from "lodash";
import {
  calculateRho,
  calculateUx,
  calculateUy,
  getEquilibriumDistribution,
  getGravityForce,
} from "../cell";

describe("cell", () => {
  describe("rho", () => {
    it("all 0 density 0 rho", () => {
      const rho = calculateRho(0, 0, 0, 0, 0, 0, 0, 0, 0);
      expect(rho).toBe(0);
    });
    it("all 1 density 9 rho", () => {
      const rho = calculateRho(1, 1, 1, 1, 1, 1, 1, 1, 1);
      expect(rho).toBe(9);
    });
  });

  describe("ux", () => {
    it("all 0 density 0 speed", () => {
      const ux = calculateUx(0, 0, 0, 0, 0, 0, 1);
      expect(ux).toBe(0);
    });
    it("all E density max speed", () => {
      const ux = calculateUx(0, 1, 0, 1, 0, 1, 1);
      expect(ux).toBe(3);
    });
    it("all W density min speed", () => {
      const ux = calculateUx(1, 0, 1, 0, 1, 0, 1);
      expect(ux).toBe(-3);
    });
  });

  describe("uy", () => {
    it("all 0 density 0 speed", () => {
      const uy = calculateUy(0, 0, 0, 0, 0, 0, 1);
      expect(uy).toBe(0);
    });
    it("all N density max speed", () => {
      const uy = calculateUy(1, 1, 1, 0, 0, 0, 1);
      expect(uy).toBe(3);
    });
    it("all S density min speed", () => {
      const uy = calculateUy(0, 0, 0, 1, 1, 1, 1);
      expect(uy).toBe(-3);
    });
  });

  describe("eq", () => {
    it("density conservation", () => {
      // random density
      const rho = 1.094;
      const eq = getEquilibriumDistribution(rho, 0, 0);
      const newRho = calculateRho(
        eq.NW,
        eq.N,
        eq.NE,
        eq.W,
        eq.C,
        eq.E,
        eq.SW,
        eq.S,
        eq.SE,
      );
      expect(newRho).toBeCloseTo(rho);
    });

    it("ux conservation", () => {
      // random ux
      const ux = 0.058;
      const eq = getEquilibriumDistribution(1, ux, 0);
      const newUx = calculateUx(eq.NW, eq.NE, eq.W, eq.E, eq.SW, eq.SE, 1);
      expect(newUx).toBeCloseTo(ux);
    });

    it("uy conservation", () => {
      // random uy
      const uy = 0.129;
      const eq = getEquilibriumDistribution(1, 0, uy);
      const newUy = calculateUy(eq.NW, eq.N, eq.NE, eq.SW, eq.S, eq.SE, 1);
      expect(newUy).toBeCloseTo(uy);
    });

    it("no macro speed", () => {
      const eq = getEquilibriumDistribution(1, 0, 0);
      expect(eq.C).toBeCloseTo(4 / 9);
      expect(eq.E).toBeCloseTo(1 / 9);
      expect(eq.N).toBeCloseTo(1 / 9);
      expect(eq.W).toBeCloseTo(1 / 9);
      expect(eq.S).toBeCloseTo(1 / 9);
      expect(eq.NE).toBeCloseTo(1 / 36);
      expect(eq.NW).toBeCloseTo(1 / 36);
      expect(eq.SW).toBeCloseTo(1 / 36);
      expect(eq.SE).toBeCloseTo(1 / 36);
    });
  });

  describe("gravity force", () => {
    it("sum = 0", () => {
      const G = getGravityForce(1, 1.027, 0.023, -0.109);
      const sumG = sum([G.C, G.E, G.N, G.W, G.S, G.NE, G.NW, G.SW, G.SE]);
      expect(sumG).toBeCloseTo(0);
    });
    it("no x contribution", () => {
      const G = getGravityForce(1, 0.987, -0.103, -0.099);
      const sumGx = sum([G.E, -G.W, G.NE, -G.NW, -G.SW, G.SE]);
      expect(sumGx).toBeCloseTo(0);
    });
    it("y contribution = - rho * g", () => {
      const g = 1;
      const rho = 1.078;
      const G = getGravityForce(g, rho, -0.103, -0.099);
      const sumGy = sum([G.N, -G.S, G.NE, G.NW, -G.SW, -G.SE]);
      expect(sumGy).toBeCloseTo(-g * rho);
    });
  });
});
