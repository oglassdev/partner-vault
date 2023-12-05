use genpdf::fonts;
use serde::{Deserialize, Serialize};

#[derive(Serialize,Deserialize)]
pub struct ReportOpts {
    user_name: String,
    user_id: String,
    team_name: String,
    team_id: String,
    partners: Vec<Partner>,
    users: Vec<User>,

    path: String
}
#[derive(Serialize,Deserialize)]
pub struct Partner {
    id: String,
    name: String,
    partner_type: String,
    contacts: Vec<String>,
    created_at: String
}
#[derive(Serialize,Deserialize)]
pub struct User {
    id: String,
    username: String,
    public_email: String
}
pub fn generateReport(opts: &ReportOpts) {
}