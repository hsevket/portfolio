using Microsoft.AspNetCore.Mvc;

namespace mycore.Controllers
{
    public class AboutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}