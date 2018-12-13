<?php
/**
 * Created by PhpStorm.
 * User: jdi
 * Date: 12/12/2018
 * Time: 9:26 μμ
 */

namespace App\Services;


use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class CurrenciesService
 * Class MainController: Main application controller, handles all actions - requests. Uses 2 services CurrenciesService
 * and CurrenciesService to retrieve and persist currencies and rates.
 *
 * @package App\Services
 */
class CurrenciesService
{
    private $storage;

    public function __construct(SessionInterface $session)
    {
        $this->storage = $session;
    }

    public function getCurrencies()
    {
        $val = $this->storage->get('currencies');
        if (empty($val)) {
            $val = [
                'EUR' => 'Euro',
                'USD' => 'US Dollar',
                'CAD' => 'Canadian Dollar',
                'NZD' => 'N. Zealand Dollar',
                'GBP' => 'British Pound',
                'CHF' => 'Swiss Franc',
                'JPY' => 'Japanese Yen',
            ];
            $this->storage->set('currencies', $val);
        }
        return $val;
    }

    public function insert($code, $description)
    {
        $currencies = $this->storage->get('currencies');
        if (isset($currencies[$code])) {
            throw new \Exception('Currency exists!');
        }
        $currencies[$code] = $description;
        $this->storage->set('currencies', $currencies);
        return true;
    }
}