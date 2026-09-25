"""
PackSmart AI - PDF Report Generation Service
Generates publication-quality technical packaging recommendation reports using ReportLab.
"""
import io
import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)

def generate_analysis_pdf(analysis_data: dict, user_name: str = "Research Partner") -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Palette
    DARK_BG = colors.HexColor("#101512")
    FOREST = colors.HexColor("#203128")
    EMERALD = colors.HexColor("#2E5B3D")
    LIME = colors.HexColor("#7FAF6A")
    AMBER = colors.HexColor("#D6A85F")
    WARM_WHITE = colors.HexColor("#F9F7F1")
    TEXT_MUTED = colors.HexColor("#5A6B5F")
    BORDER_COLOR = colors.HexColor("#D1D8D0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=FOREST,
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_MUTED,
        spaceAfter=12
    )
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=EMERALD,
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=DARK_BG
    )
    bold_style = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=TEXT_MUTED
    )

    story = []

    # Title & Header
    story.append(Paragraph("PACKSMART AI", title_style))
    story.append(Paragraph("AI-Based Intelligent Food Packaging Recommendation System", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=LIME, spaceBefore=2, spaceAfter=8))

    # Meta Info Table
    analysis_id = analysis_data.get("id", "AN-1001")
    created_at = analysis_data.get("created_at")
    date_str = created_at.strftime("%B %d, %Y %H:%M") if hasattr(created_at, "strftime") else str(created_at)[:19]
    
    meta_table_data = [
        [
            Paragraph(f"<b>Analysis ID:</b> #{analysis_id}", body_style),
            Paragraph(f"<b>Date:</b> {date_str}", body_style),
            Paragraph(f"<b>User / Role:</b> {user_name}", body_style),
            Paragraph(f"<b>Risk Assessment:</b> <b>{analysis_data.get('overall_risk_level', 'LOW')}</b>", body_style),
        ]
    ]
    t_meta = Table(meta_table_data, colWidths=[130, 140, 140, 130])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), WARM_WHITE),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # Section 1: Food Commodity & Storage Profile
    story.append(Paragraph("1. Food Matrix & Storage Profile", heading_style))
    input_table_data = [
        [
            Paragraph("<b>Parameter</b>", bold_style),
            Paragraph("<b>Specified Value</b>", bold_style),
            Paragraph("<b>Parameter</b>", bold_style),
            Paragraph("<b>Specified Value</b>", bold_style)
        ],
        [
            Paragraph("Target Commodity", body_style),
            Paragraph(f"{analysis_data.get('commodity_name')} ({analysis_data.get('commodity_category', 'Fresh')})", body_style),
            Paragraph("Target Shelf Life", body_style),
            Paragraph(f"{analysis_data.get('target_shelf_life_days')} Days", body_style),
        ],
        [
            Paragraph("Moisture Content", body_style),
            Paragraph(f"{analysis_data.get('moisture_pct')}%", body_style),
            Paragraph("Storage Environment", body_style),
            Paragraph(f"{analysis_data.get('storage_temp_c')}°C | {analysis_data.get('storage_humidity_pct')}% RH", body_style),
        ],
        [
            Paragraph("Fat / Lipid Content", body_style),
            Paragraph(f"{analysis_data.get('fat_pct')}%", body_style),
            Paragraph("Transport Vector", body_style),
            Paragraph(f"{analysis_data.get('transport_type', 'Road')} ({analysis_data.get('transport_duration_days', 2)} days)", body_style),
        ],
        [
            Paragraph("Matrix pH / Respiration", body_style),
            Paragraph(f"pH {analysis_data.get('ph')} | {analysis_data.get('respiration_rate')} Respiration", body_style),
            Paragraph("Transport Condition", body_style),
            Paragraph(f"{analysis_data.get('transport_condition', 'Normal')}", body_style),
        ]
    ]
    t_input = Table(input_table_data, colWidths=[135, 135, 135, 135])
    t_input.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), FOREST),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_input)
    story.append(Spacer(1, 10))

    # Section 2: Top 3 Packaging Recommendations
    story.append(Paragraph("2. AI Packaging Recommendations (Ranked Top 3)", heading_style))
    
    recs = analysis_data.get("recommendations", [])
    rec_table_data = [
        [
            Paragraph("<b>Rank & Role</b>", bold_style),
            Paragraph("<b>Recommended Material</b>", bold_style),
            Paragraph("<b>Barrier (OTR / WVTR)</b>", bold_style),
            Paragraph("<b>Cost (Unit)</b>", bold_style),
            Paragraph("<b>Sust. / Prot.</b>", bold_style),
            Paragraph("<b>Overall Score</b>", bold_style),
        ]
    ]
    
    for r in recs:
        rec_type = r.get("recommendation_type", "")
        if ":" in rec_type:
            rec_type = rec_type.split(":")[1].strip()
        mat_name = f"<b>{r.get('material_name')}</b><br/><font size=7.5 color='#5A6B5F'>{r.get('material_structure')}</font>"
        barrier = f"OTR: {r.get('otr')} cc<br/>WVTR: {r.get('wvtr')} g"
        cost = f"₹{r.get('estimated_cost_unit', 0):.2f}"
        sust_prot = f"S: {r.get('sustainability_score', 0):.0f} / P: {r.get('protection_score', 0):.0f}"
        ov_score = f"<b>{r.get('overall_score', 0):.1f}/100</b>"
        
        rec_table_data.append([
            Paragraph(f"#{r.get('rank', 1)}<br/><font size=7 color='#2E5B3D'>{rec_type}</font>", body_style),
            Paragraph(mat_name, body_style),
            Paragraph(barrier, body_style),
            Paragraph(cost, body_style),
            Paragraph(sust_prot, body_style),
            Paragraph(ov_score, bold_style),
        ])

    t_recs = Table(rec_table_data, colWidths=[95, 175, 100, 55, 65, 50])
    t_recs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), FOREST),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, WARM_WHITE]),
    ]))
    story.append(t_recs)
    story.append(Spacer(1, 10))

    # Section 3: Explainable AI & Technical Rationale
    if recs:
        top_rec = recs[0]
        story.append(Paragraph("3. Explainable AI: Why This Material Was Selected", heading_style))
        why_bullets = top_rec.get("why_points", [])
        if why_bullets:
            for pt in why_bullets[:4]:
                story.append(Paragraph(f"• <b>Compliance Point:</b> {pt}", body_style))
                story.append(Spacer(1, 2))
        
        # Counterfactual triggers
        triggers = top_rec.get("what_would_change", [])
        if triggers:
            story.append(Spacer(1, 3))
            story.append(Paragraph("<b>Sensitivity Triggers (What Would Alter This Recommendation):</b>", bold_style))
            for trg in triggers[:2]:
                story.append(Paragraph(f"• {trg}", body_style))
                story.append(Spacer(1, 2))
    
    story.append(Spacer(1, 8))

    # Section 4: Risk Analysis Table
    if recs and recs[0].get("risks"):
        story.append(Paragraph("4. Packaging Risk Matrix & Active Mitigations", heading_style))
        risk_table_data = [
            [
                Paragraph("<b>Identified Risk</b>", bold_style),
                Paragraph("<b>Level</b>", bold_style),
                Paragraph("<b>Root Cause</b>", bold_style),
                Paragraph("<b>Recommended Mitigation</b>", bold_style)
            ]
        ]
        for rk in recs[0].get("risks", [])[:3]:
            risk_table_data.append([
                Paragraph(rk.get("risk", "Risk"), body_style),
                Paragraph(f"<b>{rk.get('level', 'Mod')}</b><br/>({rk.get('probability_pct', 50)}%)", body_style),
                Paragraph(rk.get("reason", "-"), body_style),
                Paragraph(rk.get("mitigation", "-"), body_style),
            ])
        t_risk = Table(risk_table_data, colWidths=[120, 50, 180, 190])
        t_risk.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), FOREST),
            ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_risk)
        story.append(Spacer(1, 10))

    # Section 5: Cost, Sustainability & Simulation Summary
    cost = analysis_data.get("cost_estimate") or {}
    sust = analysis_data.get("sustainability_score") or {}
    
    story.append(Paragraph("5. Economic & Sustainability Impact Summary", heading_style))
    summary_data = [
        [
            Paragraph(f"<b>Batch Quantity:</b> {cost.get('quantity', 10000):,} units", body_style),
            Paragraph(f"<b>Baseline Packaging Cost:</b> ₹{cost.get('total_cost_current', 0):,.2f}", body_style),
            Paragraph(f"<b>Recommended Packaging Cost:</b> ₹{cost.get('total_cost_recommended', 0):,.2f}", body_style),
            Paragraph(f"<b>Cost Savings:</b> <b>{cost.get('cost_savings_pct', 0)}%</b>", bold_style),
        ],
        [
            Paragraph(f"<b>Material Circularity:</b> {sust.get('recyclability_pct', 75)}%", body_style),
            Paragraph(f"<b>Estimated Carbon Avoided:</b> {sust.get('carbon_saved_kg', 0)} kg CO₂e", body_style),
            Paragraph(f"<b>Plastic Weight Reduction:</b> {sust.get('plastic_reduction_pct', 0)}%", body_style),
            Paragraph(f"<b>Eco Rating:</b> <b>{sust.get('environmental_rating', 'A')}</b>", bold_style),
        ]
    ]
    t_sum = Table(summary_data, colWidths=[135, 145, 150, 110])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), WARM_WHITE),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_sum)
    story.append(Spacer(1, 14))

    # Legal & scientific disclaimer
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=4, spaceAfter=6))
    story.append(Paragraph(
        "<b>LEGAL & SCIENTIFIC DISCLAIMER:</b> Results generated by PackSmart AI are decision-support estimates based on user-supplied parameters and empirical food packaging science models. Laboratory testing, accelerated shelf-life validation, and regulatory compliance assessment (FSSAI / FDA) are required before commercial packaging deployment.",
        disclaimer_style
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer
