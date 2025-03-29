export async function dashboard(req,res){

    try {
        
        res.render("dashboard", { title: "Dashboard" });
        
    } catch (error) {
        return res.status(500).render("error", { message: error.message });
        
    }
}