const supabase = require("../config/supabase");

exports.getSweets = async (req, res) => {
  const { data, error } = await supabase.from("sweets").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};

exports.addSweet = async (req, res) => {
  const { name, price, quantity } = req.body;

  const { error } = await supabase.from("sweets").insert([
    { name, price, quantity }
  ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Sweet added successfully" });
};
