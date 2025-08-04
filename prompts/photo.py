def get_photo_prompt():
    return f"""
Analyze this facial image and provide skincare recommendations.

Look at the image and identify:
- Skin texture and pore visibility
- Any blemishes, dark spots, or uneven areas
- Signs of dryness, oiliness, or combination skin
- Overall skin tone and any areas of concern

Then provide:
1. 2-3 specific observations about the skin in this image
2. 3 skincare product recommendations with purchase links
3. Format everything in attractive HTML

Be specific about what you see in THIS image. Provide helpful, practical skincare advice based on your visual analysis.

Example format:
<div style="font-family: Arial; max-width: 600px; margin: 20px;">
<h2>Skin Analysis Results</h2>
<h3>What I Notice:</h3>
<ul>
<li>Specific observation 1</li>
<li>Specific observation 2</li>
</ul>
<h3>Recommended Products:</h3>
<div>Product recommendations with links</div>
</div>
"""