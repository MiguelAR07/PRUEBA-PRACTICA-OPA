
	Proceso NumerosPerfectosEnRango
		Definir c como entero;
		Definir n, m, i como Real;
		
		Repetir
			Escribir sin saltar "Ingrese el rango Inferior:";
			Leer n;
		Hasta Que n > 0
		
		Repetir
			Escribir sin saltar "Ingrese el rango Superior:";
			Leer m;
		Hasta Que m > n
		
		Escribir "";
		c <- 0;
		Para i <- n Hasta m Con Paso 1 Hacer
			Si EsPerfecto(i) Entonces
				Escribir i, " Es perfecto";
				c <- c + 1;
			FinSi
		FinPara
		
		Escribir "";
		Escribir "En el rango [", n, ",", m, "] hay ", c, " números perfectos"
		
FinProceso
//Proceso *****************************************************************************************
		
		SubProceso perfecto <- EsPerfecto(n)
			Definir i, sd, ni como real;
			Definir perfecto como logico;
			sd <- 1;     i <- 0;     ni <- n;
			Mientras (ni mod 2) = 0 Hacer
				i <- i + 1;
				sd <- sd + 2^i + (n / (2^i));
				ni <- ni / 2;
			FinMientras
			
			Si n = sd y EsPrimo(ni) Entonces
				perfecto <- verdadero;
			SiNo
				perfecto <- falso;
			FinSi
FinSubProceso

//**************************************************************************************************
		
		SubProceso primo <- EsPrimo(n)
			definir primo como logico;
			Definir i como entero;
			primo <- verdadero;
			Si n = 1 o ((n mod 2) = 0 y n > 2) o (raiz(n) = trunc(raiz(n))) Entonces
				primo <- falso;
			SiNo
				Para i <- 3 Hasta raiz(n) Con Paso 2 Hacer
					Si (n mod i) = 0 Entonces
						primo <- falso;
						i <- n; // Para salir del Bucle
					FinSi
				FinPara
			FinSi
FinSubProceso


