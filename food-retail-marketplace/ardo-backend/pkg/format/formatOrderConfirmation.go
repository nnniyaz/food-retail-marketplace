package format

import (
	"fmt"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/pkg/core"
)

func FormatOrderConfirmation(order *order.Order) string {
	htmlBody := "<table style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; width: 100%; box-sizing: border-box; padding: 25px 0; text-align: center; border-spacing: 0'>"
	htmlBody += "<tbody>"
	htmlBody += "<tr>"
	htmlBody += "<td>"
	htmlBody += "<div style='display: flex; justify-content: center'>"
	htmlBody += "<svg width='250' height='130' viewBox='0 0 858 230' fill='none' xmlns='http://www.w3.org/2000/svg'>"
	htmlBody += "<path fill-rule='evenodd' clip-rule='evenodd' d='M109.796 13.018C111.533 12.0257 113.499 11.5037 115.5 11.5037C117.501 11.5037 119.467 12.0257 121.204 13.018L141.329 24.518C142.678 25.2469 143.867 26.2382 144.827 27.4334C145.787 28.6287 146.499 30.0039 146.919 31.4781C147.34 32.9523 147.462 34.4958 147.278 36.0178C147.094 37.5397 146.607 39.0095 145.846 40.3406C145.085 41.6717 144.066 42.8373 142.849 43.7688C141.631 44.7003 140.239 45.379 138.756 45.7648C137.272 46.1507 135.726 46.236 134.209 46.0157C132.692 45.7954 131.234 45.2739 129.921 44.482L115.5 36.248L101.079 44.482C99.7663 45.2739 98.3084 45.7954 96.7912 46.0157C95.274 46.236 93.7281 46.1507 92.2444 45.7648C90.7606 45.379 89.369 44.7003 88.1513 43.7688C86.9337 42.8373 85.9146 41.6717 85.1539 40.3406C84.3933 39.0095 83.9065 37.5397 83.7221 36.0178C83.5378 34.4958 83.6597 32.9523 84.0805 31.4781C84.5014 30.0039 85.2128 28.6287 86.1728 27.4334C87.1329 26.2382 88.3223 25.2469 89.671 24.518L109.796 13.018ZM65.107 51.796C66.6189 54.4436 67.0176 57.5832 66.2154 60.5247C65.4132 63.4661 63.4757 65.9686 60.829 67.482L58.184 69L60.829 70.518C62.1777 71.2469 63.3671 72.2382 64.3272 73.4334C65.2872 74.6287 65.9986 76.0039 66.4195 77.4781C66.8403 78.9523 66.9622 80.4958 66.7778 82.0178C66.5935 83.5397 66.1067 85.0095 65.3461 86.3406C64.5854 87.6717 63.5663 88.8373 62.3487 89.7688C61.131 90.7003 59.7394 91.379 58.2556 91.7648C56.7719 92.1507 55.226 92.236 53.7088 92.0157C52.1916 91.7954 50.7337 91.2739 49.421 90.482L46.5 88.8145V92C46.5 95.05 45.2884 97.9751 43.1317 100.132C40.9751 102.288 38.05 103.5 35 103.5C31.95 103.5 29.0249 102.288 26.8683 100.132C24.7116 97.9751 23.5 95.05 23.5 92V69C23.4936 66.9341 24.046 64.905 25.0987 63.1275C26.1514 61.35 27.6653 59.8903 29.48 58.903L49.421 47.518C52.0686 46.0061 55.2082 45.6074 58.1497 46.4096C61.0911 47.2118 63.5936 49.1493 65.107 51.796ZM165.893 51.796C167.406 49.1493 169.909 47.2118 172.85 46.4096C175.792 45.6074 178.931 46.0061 181.579 47.518L201.509 58.903C203.32 59.8945 204.833 61.3549 205.887 63.1312C206.941 64.9075 207.498 66.9345 207.5 69V92C207.5 95.05 206.288 97.9751 204.132 100.132C201.975 102.288 199.05 103.5 196 103.5C192.95 103.5 190.025 102.288 187.868 100.132C185.712 97.9751 184.5 95.05 184.5 92V88.8145L181.579 90.482C180.266 91.2739 178.808 91.7954 177.291 92.0157C175.774 92.236 174.228 92.1507 172.744 91.7648C171.261 91.379 169.869 90.7003 168.651 89.7688C167.434 88.8373 166.415 87.6717 165.654 86.3406C164.893 85.0095 164.406 83.5397 164.222 82.0178C164.038 80.4958 164.16 78.9523 164.581 77.4781C165.001 76.0039 165.713 74.6287 166.673 73.4334C167.633 72.2382 168.822 71.2469 170.171 70.518L172.816 69L170.171 67.482C167.524 65.9686 165.587 63.4661 164.785 60.5247C163.982 57.5832 164.381 54.4436 165.893 51.796ZM85.393 97.796C86.9064 95.1493 89.4089 93.2118 92.3503 92.4096C95.2918 91.6074 98.4314 92.0061 101.079 93.518L115.5 101.752L129.921 93.518C131.234 92.7261 132.692 92.2046 134.209 91.9843C135.726 91.764 137.272 91.8493 138.756 92.2352C140.239 92.621 141.631 93.2997 142.849 94.2312C144.066 95.1627 145.085 96.3283 145.846 97.6594C146.607 98.9905 147.094 100.46 147.278 101.982C147.462 103.504 147.34 105.048 146.919 106.522C146.499 107.996 145.787 109.371 144.827 110.567C143.867 111.762 142.678 112.753 141.329 113.482L127 121.67V138C127 141.05 125.788 143.975 123.632 146.132C121.475 148.288 118.55 149.5 115.5 149.5C112.45 149.5 109.525 148.288 107.368 146.132C105.212 143.975 104 141.05 104 138V121.67L89.671 113.482C87.0243 111.969 85.0868 109.466 84.2846 106.525C83.4824 103.583 83.8811 100.444 85.393 97.796ZM35 126.5C38.05 126.5 40.9751 127.712 43.1317 129.868C45.2884 132.025 46.5 134.95 46.5 138V154.33L60.829 162.518C62.1777 163.247 63.3671 164.238 64.3272 165.433C65.2872 166.629 65.9986 168.004 66.4195 169.478C66.8403 170.952 66.9622 172.496 66.7778 174.018C66.5935 175.54 66.1067 177.01 65.3461 178.341C64.5854 179.672 63.5663 180.837 62.3487 181.769C61.131 182.7 59.7394 183.379 58.2556 183.765C56.7719 184.151 55.226 184.236 53.7088 184.016C52.1916 183.795 50.7337 183.274 49.421 182.482L29.296 170.982C27.5359 169.977 26.0728 168.524 25.0549 166.771C24.0371 165.018 23.5006 163.027 23.5 161V138C23.5 134.95 24.7116 132.025 26.8683 129.868C29.0249 127.712 31.95 126.5 35 126.5ZM196 126.5C199.05 126.5 201.975 127.712 204.132 129.868C206.288 132.025 207.5 134.95 207.5 138V161C207.499 163.027 206.963 165.018 205.945 166.771C204.927 168.524 203.464 169.977 201.704 170.982L181.579 182.482C180.266 183.274 178.808 183.795 177.291 184.016C175.774 184.236 174.228 184.151 172.744 183.765C171.261 183.379 169.869 182.7 168.651 181.769C167.434 180.837 166.415 179.672 165.654 178.341C164.893 177.01 164.406 175.54 164.222 174.018C164.038 172.496 164.16 170.952 164.581 169.478C165.001 168.004 165.713 166.629 166.673 165.433C167.633 164.238 168.822 163.247 170.171 162.518L184.5 154.33V138C184.5 134.95 185.712 132.025 187.868 129.868C190.025 127.712 192.95 126.5 196 126.5ZM85.393 189.796C86.9064 187.149 89.4089 185.212 92.3503 184.41C95.2918 183.607 98.4314 184.006 101.079 185.518L104 187.186V184C104 180.95 105.212 178.025 107.368 175.868C109.525 173.712 112.45 172.5 115.5 172.5C118.55 172.5 121.475 173.712 123.632 175.868C125.788 178.025 127 180.95 127 184V187.186L129.921 185.518C131.234 184.726 132.692 184.205 134.209 183.984C135.726 183.764 137.272 183.849 138.756 184.235C140.239 184.621 141.631 185.3 142.849 186.231C144.066 187.163 145.085 188.328 145.846 189.659C146.607 190.99 147.094 192.46 147.278 193.982C147.462 195.504 147.34 197.048 146.919 198.522C146.499 199.996 145.787 201.371 144.827 202.567C143.867 203.762 142.678 204.753 141.329 205.482L121.376 216.89C119.601 217.953 117.57 218.514 115.5 218.514C113.43 218.514 111.399 217.953 109.624 216.89L89.671 205.482C87.0243 203.969 85.0868 201.466 84.2846 198.525C83.4824 195.583 83.8811 192.444 85.393 189.796Z' fill='#005FF9'/>"
	htmlBody += "<path d='M367.824 192L356.223 155.086H302.75L291.148 192H258.453L311.293 39.8086H348.734L401.68 192H367.824ZM329.117 68.918L309.605 131.25H349.367L329.855 68.918H329.117ZM449.141 64.6992V113.215H476.562C492.594 113.215 501.98 104.039 501.98 88.957C501.98 74.1914 492.066 64.6992 476.246 64.6992H449.141ZM449.141 136.312V192H417.289V39.8086H479.621C514.637 39.8086 534.676 58.2656 534.676 88.3242C534.676 107.836 524.551 124.711 507.043 131.566L539.105 192H503.035L474.664 136.312H449.141ZM555.664 39.8086H613.777C659.445 39.8086 686.34 67.0195 686.34 115.324C686.34 163.629 659.445 192 613.777 192H555.664V39.8086ZM587.516 66.0703V165.633H609.98C638.457 165.633 653.855 148.336 653.855 115.43C653.855 83.5781 638.035 66.0703 609.98 66.0703H587.516ZM775.566 37.1719C820.602 37.1719 848.973 67.4414 848.973 115.957C848.973 164.367 820.602 194.637 775.566 194.637C730.426 194.637 702.16 164.367 702.16 115.957C702.16 67.4414 730.426 37.1719 775.566 37.1719ZM775.566 63.75C750.676 63.75 734.645 84 734.645 115.957C734.645 147.809 750.57 167.953 775.566 167.953C800.457 167.953 816.383 147.809 816.383 115.957C816.383 84 800.457 63.75 775.566 63.75Z' fill='#005FF9'/>"
	htmlBody += "</svg>"
	htmlBody += "</div>"
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "<tr>"
	htmlBody += "<td cellpadding='0' cellspacing='0' style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 0; border-top: 1px solid #e9eaec; border-bottom: 1px solid #e9eaec; background-color: #ffffff'>"
	htmlBody += "<table align='center' cellspacing='0' style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; max-width: 570px; width: 100%; margin: 0 auto; padding: 0; background-color: #ffffff'>"
	htmlBody += "<tbody style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box'>"
	htmlBody += "<tr>"
	htmlBody += "<td style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding: 35px'>"
	// =================================================================================================================

	// Order Number
	htmlBody += fmt.Sprintf("<h1 style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 19px; font-weight: 600; margin: 0; padding: 25px 0; text-align: left'>Order number №%s</h1>", order.GetNumber().String())

	// Product
	htmlBody += "<table cellpadding='0' cellspacing='0' style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 25px 0 0'>"
	htmlBody += "<tbody>"
	htmlBody += "<tr>"
	htmlBody += "<th style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding-bottom: 8px; border-bottom: 1px solid #e9eaec'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin: 0; color: #a7adb2; font-size: 12px'>"
	htmlBody += "Name"
	htmlBody += "</p>"
	htmlBody += "</th>"
	htmlBody += "<th style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding-bottom: 8px; border-bottom: 1px solid #e9eaec'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin: 0; color: #a7adb2; font-size: 12px'>"
	htmlBody += "Price"
	htmlBody += "</p>"
	htmlBody += "</th>"
	htmlBody += "<th style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding-bottom: 8px; border-bottom: 1px solid #e9eaec'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin: 0; color: #a7adb2; font-size: 12px'>"
	htmlBody += "Total"
	htmlBody += "</p>"
	htmlBody += "</th>"
	htmlBody += "</tr>"

	for i := 0; i < len(order.GetProducts()); i++ {
		htmlBody += "<tr>"
		htmlBody += "<td style='width: 50%; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding: 10px 0; color: #747f88; font-size: 15px; line-height: 18px; text-align: left'>"
		htmlBody += fmt.Sprintf("<span>%s</span>", order.GetProducts()[i].GetProductName().GetByLangOrEmpty(core.EN))
		htmlBody += "</td>"
		htmlBody += "<td style='width: 30%; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding: 10px 0; color: #747f88; font-size: 15px; line-height: 18px; text-align: right'>"
		htmlBody += fmt.Sprintf("<span>%.2f x %d</span>", order.GetProducts()[i].GetPricePerUnit(), order.GetProducts()[i].GetQuantity())
		htmlBody += "</td>"
		htmlBody += "<td style='width: 20%; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding: 10px 0; color: #747f88; font-size: 15px; line-height: 18px; text-align: right'>"
		htmlBody += fmt.Sprintf("<span>%.2f</span>", order.GetProducts()[i].GetTotalPrice())
		htmlBody += "</td>"
		htmlBody += "</tr>"
	}

	htmlBody += "<tr>"
	htmlBody += "<td colspan='2' style='width: 85%; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding-top: 15px; border-top: 1px solid #e9eaec'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin: 0; color: #232837; font-size: 16px; font-weight: bold'>"
	htmlBody += "Total"
	htmlBody += "</p>"
	htmlBody += "</td>"
	htmlBody += "<td style='width: 15%; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding-top: 15px; border-top: 1px solid #e9eaec'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin: 0; color: #232837; font-size: 16px; font-weight: bold'>"
	htmlBody += fmt.Sprintf("%.2f", order.GetTotalPrice())
	htmlBody += "</p>"
	htmlBody += "</td>"
	htmlBody += "</tr>"

	htmlBody += "<tr>"
	htmlBody += "<td colspan='2' style='width: 85%; vertical-align: middle; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin-top: 0; color: #74787e; font-size: 16px'>"
	htmlBody += "Total"
	htmlBody += "</p>"
	htmlBody += "</td>"
	htmlBody += "<td style='width: 15%; vertical-align: middle; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box'>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin-top: 0; color: #74787e; font-size: 16px'>"
	htmlBody += fmt.Sprintf("%.2f", order.GetTotalPrice())
	htmlBody += "</p>"
	htmlBody += "</td>"
	htmlBody += "</tr>"

	htmlBody += "<tr>"
	htmlBody += "<td colspan='3' style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; padding-top: 15px; border-top: 1px solid #e9eaec'></td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"

	// Link to Cheque
	htmlBody += "<table cellpadding='0' cellspacing='0' align='center' style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; width: 100%; margin: 30px auto; padding: 0; text-align: center'>"
	htmlBody += "<tbody>"
	htmlBody += "<tr>"
	htmlBody += "<td align='center'>"
	htmlBody += "<table cellpadding='0' cellspacing='0' border='0'>"
	htmlBody += "<tbody>"
	htmlBody += "<tr>"
	htmlBody += "<td align='center'>"
	htmlBody += "<table cellpadding='0' cellspacing='0' border='0'>"
	htmlBody += "<tbody>"
	htmlBody += "<tr>"
	htmlBody += "<td>"
	htmlBody += "<a href='' style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; color: #ffffff; border-right :18px solid #005FF9; border-bottom: 10px solid #005FF9; border-left: 18px solid #005FF9; display: inline-block; text-decoration: none; border-radius: 3px; background-color: #005FF9; border-top: 10px solid #005FF9' target='_blank' data-saferedirecturl=''>"
	htmlBody += "Receipt"
	htmlBody += "</a>"
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"

	// Credentials
	htmlBody += "<table style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; margin-top: 25px; padding-top: 25px; border-top: 1px solid #e9eaec'>"
	htmlBody += "<tbody>"
	htmlBody += "<tr>"
	htmlBody += "<td>"
	htmlBody += "<p style='font-family: Arial, Helvetica Neue, Helvetica, sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787e; font-size: 12px'>"
	htmlBody += "The reason for this letter is that '<span style='background-color: rgba(0, 95, 249, 0.2); color: #222'>Ardo</span> Group Ltd.' has written down your e-mail address to send a fiscal cheque."
	htmlBody += "</p>"
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"

	// =================================================================================================================
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"
	htmlBody += "</td>"
	htmlBody += "</tr>"
	htmlBody += "</tbody>"
	htmlBody += "</table>"

	return htmlBody
}
