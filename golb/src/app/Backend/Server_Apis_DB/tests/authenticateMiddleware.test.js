const authenticateToken = require("../middleware/AuthenticateMiddleware");
const jwt = require("jsonwebtoken");

// Mock jwt.verify
jest.mock("jsonwebtoken");

describe("authenticateToken middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("returns 401 if token is missing", () => {
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Access denied. Token missing." });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 if token is invalid", () => {
    req.headers["authorization"] = "Bearer invalid_token";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token." });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next if token is valid", () => {
    req.headers["authorization"] = "Bearer valid_token";
    const mockUser = { id: 1, username: "testuser" };

    jwt.verify.mockReturnValue(mockUser);

    authenticateToken(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
