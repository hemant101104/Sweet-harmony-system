const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const token = jwt.sign(
    {
      id: data.user.id,
      role: data.user.user_metadata.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};
