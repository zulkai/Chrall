"use strict";
(function(chrall){

	// il faut stocker le numéro du monstre sélectionné car on ne l'a pas dans les résultats de l'insulte
	chrall.prepareInsulte = function(){
		$('select[name="ai_IDTarget"]').change(function(){
			var s = $(this).val();
			s = s.substring(3, s.length);
			localStorage['cible_insulte'] = s;
		});
	};

	chrall.analyseResultatInsulte = function(){
		if (!chrall.compteChrallActif()) {
			return;
		}
		var	text = $('body').text(),
			lines = text.split('\n'),
			result = {},
			atoi = chrall.atoi;
		for (var i = lines.length; i-- > 0;) {
			var line = lines[i];
			if (line.indexOf("Compétence Insulte") == 0) {
				var i0 = line.indexOf("(");
				var i1 = line.indexOf(")");
				if (i0 > i1 && i0 > 0) {
					result.NumCible = parseInt(line.substring(i0, i1));
				}
			} else {
				if (line.indexOf("Page générée") > 0) {
					var t = chrall.tokenize(line);
					var d = new Date(atoi(t[2]), atoi(t[1]) - 1, atoi(t[0]), atoi(t[3]), atoi(t[4]), atoi(t[5]));
					result.Date = d.getTime() / 1000;
				}
			}
		}
		result.Succes = text.indexOf("pleinement") > 0;
		result.TypeCible = 'monstre';
		result.Type = 'Insulte';
		result.NumCible = parseInt(localStorage['cible_insulte']);

		chrall.sendToChrallServer(
				"insulte",
				{"Action": result}
		);
	};

})(window.chrall = window.chrall || {});

